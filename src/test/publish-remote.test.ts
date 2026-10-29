// @vitest-environment node
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { cwd } from "node:process";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const SCRIPT = join(cwd(), "scripts/publish-remote.sh");
const STAGING = ".deploy-abc123";
const HOME = "index.html";
const DAY = 24 * 60 * 60;

let remote: string;

function put(path: string, content: string, ageDays = 0) {
  const full = join(remote, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  if (ageDays) {
    const time = Date.now() / 1000 - ageDays * DAY;
    utimesSync(full, time, time);
  }
}

const read = (path: string) => readFileSync(join(remote, path), "utf8");
const exists = (path: string) => existsSync(join(remote, path));

beforeEach(() => {
  remote = mkdtempSync(join(tmpdir(), "publish-remote-"));
  // Live site: the previous build
  put(HOME, "old home");
  put(".htaccess", "old rules");
  put("blog/old-post/index.html", "removed post");
  put("_astro/old.css", "stale asset", 40);
  put("_astro/recent.css", "previous asset", 5);
  // Uploaded new build
  put(`${STAGING}/${HOME}`, "new home");
  put(`${STAGING}/.htaccess`, "new rules");
  put(`${STAGING}/blog/new-post/index.html`, "new post");
  put(`${STAGING}/_astro/new.css`, "new asset");
});

afterEach(() => rmSync(remote, { recursive: true, force: true }));

describe("publish-remote.sh", () => {
  it("publishes the new build, keeps recent hashed assets and prunes old ones", () => {
    execFileSync("bash", [SCRIPT, remote, STAGING]);

    expect(read(HOME)).toBe("new home");
    expect(read(".htaccess")).toBe("new rules");
    expect(read("blog/new-post/index.html")).toBe("new post");
    expect(exists("blog/old-post/index.html")).toBe(false);
    expect(read("_astro/new.css")).toBe("new asset");
    expect(read("_astro/recent.css")).toBe("previous asset");
    expect(exists("_astro/old.css")).toBe(false);
    expect(exists(STAGING)).toBe(false);
  });

  it("never prunes an old asset that the new build still uses", () => {
    put("_astro/shared.woff2", "font", 90);
    put(`${STAGING}/_astro/shared.woff2`, "font");

    execFileSync("bash", [SCRIPT, remote, STAGING]);

    expect(read("_astro/shared.woff2")).toBe("font");
  });

  it("refuses to publish without rsync and leaves the site untouched", () => {
    const result = spawnSync("/bin/bash", [SCRIPT, remote, STAGING], {
      env: { PATH: join(remote, "no-bin") },
      encoding: "utf8",
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/rsync/);
    expect(read(HOME)).toBe("old home");
    expect(exists(STAGING)).toBe(true);
  });

  it("removes staging folders left behind by failed deploys", () => {
    put(".deploy-failed/index.html", "half-uploaded build");

    execFileSync("bash", [SCRIPT, remote, STAGING]);

    expect(exists(".deploy-failed")).toBe(false);
  });

  it("does not rely on process substitution, which the host shell lacks (/dev/fd)", () => {
    expect(readFileSync(SCRIPT, "utf8")).not.toMatch(/<\(/);
  });

  it("refuses a missing staging directory", () => {
    const result = spawnSync("bash", [SCRIPT, remote, ".deploy-missing"], { encoding: "utf8" });

    expect(result.status).not.toBe(0);
    expect(read(HOME)).toBe("old home");
  });
});
