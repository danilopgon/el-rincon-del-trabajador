import { describe, expect, it } from "vitest";
import {
  fetchPosts,
  formatDate,
  getSeo,
  mapPost,
  parseRankMathHead,
  rewriteBlogLinks,
  truncate,
  type FetchLike,
  type WpPost,
} from "../blog";
import fixture from "./fixtures/wp-posts.json";

const [published, bare] = fixture as unknown as WpPost[];

describe("mapPost", () => {
  it("maps the published post", () => {
    const post = mapPost(published);

    expect(post.slug).toBe("calzado-de-seguridad-clases-s1p-s3-s7");
    expect(post.title).toBe(
      "Calzado de seguridad S1P, S3 o S7: qué significa cada clase y cuál necesitas"
    );
    expect(post.category).toEqual({ name: "Calzado y EPI", slug: "calzado-y-epi" });
    expect(post.image?.src).toMatch(/calzado-seguridad-tienda-tarancon\.webp$/);
    expect(post.image?.width).toBe(1448);
    expect(post.image?.height).toBe(1086);
    expect(post.image?.alt).toMatch(/^Zapatilla de seguridad/);
    expect(post.sourceUrl).toBe(
      "https://blog.elrincondeltrabajador.com/calzado-de-seguridad-clases-s1p-s3-s7/"
    );
  });

  it("decodes entities and strips tags", () => {
    const post = mapPost(bare);

    expect(post.title).toBe("Bordado – DTF & más");
    expect(post.excerpt).toBe("Texto con … puntos");
  });

  it("drops Uncategorized and missing image", () => {
    const post = mapPost(bare);

    expect(post.category).toBeUndefined();
    expect(post.image).toBeUndefined();
  });

  it("drops a featured image without dimensions", () => {
    const media = published._embedded!["wp:featuredmedia"]![0];
    const raw = {
      ...published,
      _embedded: {
        ...published._embedded,
        "wp:featuredmedia": [{ ...media, media_details: {} }],
      },
    } as unknown as WpPost;

    expect(mapPost(raw).image).toBeUndefined();
  });

  it("keeps a hand-written excerpt as the lead", () => {
    const post = mapPost(published);

    expect(post.lead).toBe(post.excerpt);
  });

  it("drops an automatic excerpt from the lead and cleans its ellipsis", () => {
    const raw = {
      ...published,
      excerpt: {
        rendered:
          "<p>En la etiqueta de cualquier bota de seguridad hay un código: S1P, S3, S3S, S7L&hellip; No es marketing. Dice exactamente de qué te protege. [&hellip;]</p>\n",
      },
    } as WpPost;

    const post = mapPost(raw);

    expect(post.lead).toBeUndefined();
    expect(post.excerpt.endsWith("[…]")).toBe(false);
    expect(post.excerpt.startsWith("En la etiqueta de cualquier bota")).toBe(true);
  });

  it("rewrites links in the post html", () => {
    const post = mapPost(published);

    expect(post.html).toContain(
      'href="/blog/calzado-de-seguridad-clases-s1p-s3-s7/#otras-siglas-de-la-etiqueta"'
    );
  });
});

describe("rewriteBlogLinks", () => {
  const cases: [string, string][] = [
    ["https://blog.elrincondeltrabajador.com/foo/#x", "/blog/foo/#x"],
    ["http://blog.elrincondeltrabajador.com/foo", "/blog/foo/"],
    ["https://blog.elrincondeltrabajador.com/", "/blog/"],
    [
      "https://blog.elrincondeltrabajador.com/wp-content/uploads/a.webp",
      "https://blog.elrincondeltrabajador.com/wp-content/uploads/a.webp",
    ],
    ["https://wa.me/34614446827", "https://wa.me/34614446827"],
  ];

  it.each(cases)("rewrites post links and keeps assets: %s", (input, output) => {
    expect(rewriteBlogLinks(`<a href="${input}">x</a>`)).toBe(`<a href="${output}">x</a>`);
  });
});

describe("truncate", () => {
  it("keeps short text", () => {
    expect(truncate("hola mundo", 155)).toBe("hola mundo");
  });

  it("cuts long text on a word", () => {
    const result = truncate("palabra ".repeat(40), 155);

    expect(result.length).toBeLessThanOrEqual(155);
    expect(result.endsWith("…")).toBe(true);
    expect(
      result
        .slice(0, -1)
        .trim()
        .split(" ")
        .every((w) => w === "palabra")
    ).toBe(true);
  });
});

describe("formatDate", () => {
  it("formats in Spanish", () => {
    expect(formatDate("2026-10-28T17:38:00")).toBe("28 de octubre de 2026");
  });
});

function fakeFetch(
  routes: (url: string) => { body: unknown; status?: number; headers?: Record<string, string> }
): FetchLike & { calls: string[] } {
  const calls: string[] = [];
  const fn = async (url: string) => {
    calls.push(url);
    const { body, status = 200, headers = {} } = routes(url);
    return new Response(JSON.stringify(body), { status, headers });
  };
  return Object.assign(fn, { calls });
}

describe("fetchPosts", () => {
  it("paginates using X-WP-TotalPages", async () => {
    const fetchImpl = fakeFetch((url) =>
      url.includes("&page=1")
        ? { body: [bare], headers: { "X-WP-TotalPages": "2" } }
        : { body: [published], headers: { "X-WP-TotalPages": "2" } }
    );

    const posts = await fetchPosts(fetchImpl);

    expect(posts.map((p) => p.id)).toEqual([published.id, bare.id]);
    expect(fetchImpl.calls.some((u) => u.includes("&page=1"))).toBe(true);
    expect(fetchImpl.calls.some((u) => u.includes("&page=2"))).toBe(true);
  });

  it("bypasses the host page cache on every request", async () => {
    const fetchImpl = fakeFetch(() => ({ body: [], headers: { "X-WP-TotalPages": "0" } }));

    await fetchPosts(fetchImpl);

    expect(fetchImpl.calls[0]).toMatch(/[?&]_ts=\d+/);
  });

  it("returns empty list when there are no posts", async () => {
    const fetchImpl = fakeFetch(() => ({ body: [], headers: { "X-WP-TotalPages": "0" } }));

    await expect(fetchPosts(fetchImpl)).resolves.toEqual([]);
  });

  it("throws on HTTP error", async () => {
    const fetchImpl = fakeFetch(() => ({ body: { code: "down" }, status: 503 }));

    await expect(fetchPosts(fetchImpl)).rejects.toThrow(/wp-json\/wp\/v2\/posts/);
  });

  it("throws on network error", async () => {
    const fetchImpl: FetchLike = () => Promise.reject(new Error("ECONNREFUSED"));

    await expect(fetchPosts(fetchImpl)).rejects.toThrow();
  });
});

describe("parseRankMathHead", () => {
  it("extracts title and description", () => {
    expect(
      parseRankMathHead(
        '<title>A &amp; B - El Rincón</title><meta name="description" content="Desc &quot;x&quot;"/>'
      )
    ).toEqual({ title: "A & B - El Rincón", description: 'Desc "x"' });
  });

  it("tolerates missing tags", () => {
    expect(parseRankMathHead("")).toEqual({});
  });
});

describe("getSeo", () => {
  const post = mapPost(published);

  it("uses Rank Math head when available", async () => {
    const fetchImpl = fakeFetch(() => ({
      body: { success: true, head: '<title>T</title><meta name="description" content="D">' },
    }));

    await expect(getSeo(post, fetchImpl)).resolves.toEqual({ title: "T", description: "D" });
    expect(fetchImpl.calls[0]).toContain(
      `rankmath/v1/getHead?url=${encodeURIComponent(post.sourceUrl)}`
    );
  });

  it("bypasses the host page cache for the Rank Math head", async () => {
    const fetchImpl = fakeFetch(() => ({ body: { success: true, head: "" } }));

    await getSeo(post, fetchImpl);

    expect(fetchImpl.calls[0]).toMatch(/[?&]_ts=\d+/);
  });

  it("falls back when Rank Math is off", async () => {
    const fetchImpl = fakeFetch(() => ({ body: { code: "rest_no_route" }, status: 404 }));

    await expect(getSeo(post, fetchImpl)).resolves.toEqual({
      title: post.title,
      description: truncate(post.excerpt, 155),
    });
  });
});
