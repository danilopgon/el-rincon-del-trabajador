export const BLOG_ORIGIN = "https://blog.elrincondeltrabajador.com";

const UNCATEGORIZED_ID = 1;

export interface BlogImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  modified: string;
  excerpt: string;
  lead?: string; // the excerpt, only when it is hand-written and not the opening of the body
  html: string;
  category?: { name: string; slug: string };
  image?: BlogImage;
  sourceUrl: string;
}

interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

interface WpMedia {
  source_url: string;
  alt_text: string;
  media_details: { width?: number; height?: number };
}

export interface WpPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
  };
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  hellip: "…",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  laquo: "«",
  raquo: "»",
};

// Runs at build time in Node, so it cannot rely on the DOM to decode entities.
function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const point =
        code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(point) ? match : String.fromCodePoint(point);
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

export function toPlainText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Madrid",
});

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

const BLOG_LINK = /href="https?:\/\/blog\.elrincondeltrabajador\.com(\/[^"]*)?"/g;
const WP_PATHS = /^\/(wp-content|wp-json|wp-admin|wp-includes)\//;

export function rewriteBlogLinks(html: string): string {
  return html.replace(BLOG_LINK, (match, path: string | undefined) => {
    const full = path ?? "/";
    if (WP_PATHS.test(full)) return match;
    const [, slug = "", hash = ""] = /^\/([^/?#]*)\/?([?#].*)?$/.exec(full) ?? [];
    return slug ? `href="/blog/${slug}/${hash}"` : `href="/blog/${hash}"`;
  });
}

export type FetchLike = (url: string) => Promise<Response>;

export interface BlogSeo {
  title: string;
  description: string;
}

const POSTS_URL = `${BLOG_ORIGIN}/wp-json/wp/v2/posts?_embed=wp:featuredmedia,wp:term&per_page=100`;
const SEO_DESCRIPTION_MAX = 155;

// SiteGround caches REST responses by full URL; a fresh query value per request makes the
// build read what WordPress has now (a post published a minute ago, an edited Rank Math title).
const cacheBust = () => `_ts=${Date.now()}`;

const isJson = (response: Response) =>
  (response.headers.get("Content-Type") ?? "").includes("json");

// An uncached request from a datacenter IP (CI runners) can get SiteGround's anti-bot
// challenge page instead of JSON. The cached copy skips that check, and SiteGround purges
// it when a post is saved, so it is the next best answer.
async function fetchFresh(url: string, fetchImpl: FetchLike): Promise<Response> {
  const fresh = await fetchImpl(`${url}&${cacheBust()}`);
  if (!fresh.ok || isJson(fresh)) return fresh;
  console.warn(
    `${url} devolvió una página en vez de JSON (reto anti-bots); uso la copia en caché.`
  );
  return fetchImpl(url);
}

const defaultFetch: FetchLike = (url) => globalThis.fetch(url);

export async function fetchPosts(fetchImpl: FetchLike = defaultFetch): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page++) {
    const url = `${POSTS_URL}&page=${page}`;
    let response: Response;
    try {
      response = await fetchFresh(url, fetchImpl);
    } catch (error) {
      throw new Error(`No se pudo cargar el blog desde ${url}: ${String(error)}`, {
        cause: error,
      });
    }
    if (!response.ok) {
      throw new Error(`No se pudo cargar el blog desde ${url}: HTTP ${response.status}`);
    }
    if (!isJson(response)) {
      throw new Error(`No se pudo cargar el blog desde ${url}: la respuesta no devolvió JSON`);
    }
    totalPages = Number(response.headers.get("X-WP-TotalPages") ?? "1");
    const raw = (await response.json()) as WpPost[];
    posts.push(...raw.map(mapPost));
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function parseRankMathHead(head: string): { title?: string; description?: string } {
  const title = /<title>([^<]*)<\/title>/i.exec(head)?.[1];
  const description = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(head)?.[1];
  return {
    ...(title ? { title: decodeEntities(title).trim() } : {}),
    ...(description ? { description: decodeEntities(description).trim() } : {}),
  };
}

export async function getSeo(
  post: BlogPost,
  fetchImpl: FetchLike = defaultFetch
): Promise<BlogSeo> {
  const fallback = { title: post.title, description: truncate(post.excerpt, SEO_DESCRIPTION_MAX) };
  const url = `${BLOG_ORIGIN}/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(post.sourceUrl)}`;
  try {
    const response = await fetchFresh(url, fetchImpl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { head = "" } = (await response.json()) as { head?: string };
    const seo = parseRankMathHead(head);
    return {
      title: seo.title ?? fallback.title,
      description: seo.description ?? fallback.description,
    };
  } catch (error) {
    console.warn(
      `SEO de Rank Math no disponible para ${post.slug} (${String(error)}); uso título y extracto.`
    );
    return fallback;
  }
}

let allPosts: Promise<BlogPost[]> | undefined;

export function getAllPosts(): Promise<BlogPost[]> {
  allPosts ??= fetchPosts();
  return allPosts;
}

const AUTO_EXCERPT_MORE = /\s*\[…\]$/;

// WordPress fills an empty excerpt with the first words of the body plus "[…]".
// Shown as a lead it would repeat the body, so it only feeds cards and SEO.
function splitExcerpt(excerptHtml: string, bodyHtml: string): { excerpt: string; lead?: string } {
  const excerpt = toPlainText(excerptHtml).replace(AUTO_EXCERPT_MORE, "");
  const opening = excerpt.replace(/…$/, "").slice(0, 60);
  const isAuto = toPlainText(bodyHtml).startsWith(opening);
  return isAuto ? { excerpt } : { excerpt, lead: excerpt };
}

export function mapPost(raw: WpPost): BlogPost {
  const media = raw._embedded?.["wp:featuredmedia"]?.[0];
  const term = raw._embedded?.["wp:term"]?.[0]?.find((t) => t.id !== UNCATEGORIZED_ID);
  // Astro's <Image> needs real dimensions for a remote image; without them the build would stop.
  const width = media?.media_details?.width;
  const height = media?.media_details?.height;

  return {
    id: raw.id,
    slug: raw.slug,
    title: toPlainText(raw.title.rendered),
    date: raw.date,
    modified: raw.modified,
    ...splitExcerpt(raw.excerpt.rendered, raw.content.rendered),
    html: rewriteBlogLinks(raw.content.rendered),
    category: term ? { name: decodeEntities(term.name), slug: term.slug } : undefined,
    image:
      raw.featured_media && media?.source_url && width && height
        ? { src: media.source_url, alt: media.alt_text, width, height }
        : undefined,
    sourceUrl: raw.link,
  };
}
