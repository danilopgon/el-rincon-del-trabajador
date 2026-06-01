# Upgrading from scp to rsync

`scp` copies everything every time and never deletes remote files. `rsync` syncs only
changed files and removes orphaned ones (`--delete`). Worth the one-time setup.

## Install rsync on Windows

**Scoop** (recommended):
```powershell
scoop install rsync
```

**Chocolatey**:
```powershell
choco install rsync
```

Verify: `rsync --version`

## Updated deploy command

Replace the scp step in the skill with:

```bash
rsync -avz --delete -e "ssh -p {port} -i {key_path}" dist/. {user}@{host}:{remote_path}/
```

Flags:
- `-a` — archive (preserves permissions, timestamps, symlinks)
- `-v` — verbose (shows changed files)
- `-z` — compress in transit
- `--delete` — removes remote files that no longer exist locally
- `dist/.` — copies contents, same trailing-slash discipline as scp

**If using default SSH key** (key_path blank):
```bash
rsync -avz --delete -e "ssh -p {port}" dist/. {user}@{host}:{remote_path}/
```

## Update the skill version

After installing rsync, bump `metadata.version` to `"2.0"` in `SKILL.md` and
replace Step 4 with the rsync command above. Remove the "scp does not delete" hard rule.
