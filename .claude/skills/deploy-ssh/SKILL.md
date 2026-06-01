---
name: deploy-ssh
description: "Trigger: deploy, desplegar, publicar, subir al servidor, hosting, production, ssh. Build Astro SSG and deploy via scp to shared hosting using SSH key auth."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Deploy `el-rincon-del-trabajador` to shared hosting via SSH. Runs the quality gate, builds
the site, and uploads `dist/` via scp. Uses SSH key auth — no passwords in chat or on disk.

## Hard Rules

- **No credentials in files or chat** — `.deploy.json` stores connection metadata only.
  Passwords would require a `!`-prefixed terminal command to avoid leaking into the transcript.
- **Trailing slash discipline** — scp source is always `dist/.` (not `dist/` or `dist/*`)
  to copy contents _into_ the remote path, not create a nested `dist/` folder.
- **Quality gate is mandatory** — `pnpm quality` must pass (lint + typecheck + format + unit tests).
- **scp does not delete** — files removed locally stay on the server until manual cleanup.
  If pages were deleted or renamed, warn the user. See `references/rsync-upgrade.md`.

## Execution Steps

### 1 — Load config

Check for `.deploy.json` in project root. If absent, ask the user for each field and save:

```json
{
  "host": "example.com",
  "user": "username",
  "port": 22,
  "remote_path": "/home/username/public_html",
  "key_path": ""
}
```

`key_path` is optional — leave blank to use SSH's default (`~/.ssh/id_rsa`).

After saving, verify `.deploy.json` is in `.gitignore`. If not, append `/.deploy.json`.

### 2 — Quality gate + build

**IMPORTANT**: Claude's Bash tool cannot access `pnpm`, `ssh`, or `scp` on Windows — they
live in the Windows PATH, not in the isolated bash environment. Always provide these as
PowerShell commands for the user to run in their terminal.

Give the user these two commands in sequence:

```powershell
pnpm quality
```
Stop if non-zero. Then:
```powershell
pnpm build
```
Verify `dist/index.html` exists. Stop if missing.

### 3 — Deploy via scp

**PowerShell line-break gotcha**: long `user@host:path` strings break when copied from
chat and PowerShell interprets the second line as a command. Always use variables:

```powershell
$k = "$HOME\.ssh\{key_filename}"
$s = "{user}@{host}"
$dest = "$s:{remote_path}/"
scp -rP {port} -i $k dist/. $dest
```

If `key_path` is the SSH default, omit `-i $k`.

On connection failure, provide this test command:
```powershell
ssh -p {port} -i $k $s "echo ok"
```

**First-deploy permissions**: scp from Windows sets directories to 700. If the site
returns 403 Forbidden after the first deploy, fix permissions with:
```powershell
ssh -p {port} -i $k $s 'chmod -R 755 {remote_path}'
```

### 5 — Report

Show: host, remote path, build size, outcome.
If the user deleted or renamed any pages since the last deploy, remind them that orphaned
HTML files remain on the server and link to `references/rsync-upgrade.md` for the fix.

## Output Contract

- Config loaded/created (first-run notice if `.deploy.json` was just created)
- Quality gate: pass or fail with output
- Build: success or error
- scp exit code and stderr if non-zero
- Post-deploy stale-file notice (always, as a reminder)

## References

- `references/setup-ssh-key.md` — one-time SSH key setup on cPanel / shared hosting
