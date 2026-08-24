# Workflow templates

These are the GitHub Actions workflows for this project. They live here rather
than in `.github/workflows/` because adding files under that path requires a
token with the **`workflow`** OAuth scope, which was not available when the
project was pushed.

- **`ci.yml`** — runs `npm ci`, `npm test` and `npm run build` on pull requests
  and pushes to `main`.
- **`deploy.yml`** — builds with `VITE_BASE=/<repo-name>/` and publishes `dist/`
  to GitHub Pages on every push to `main`.

## Enabling them

From a shell with the GitHub CLI installed:

```bash
# 1. Grant the missing scope (opens a browser)
gh auth refresh -s workflow

# 2. Move the workflows into place
mkdir -p .github/workflows
git mv workflow-templates/ci.yml     .github/workflows/ci.yml
git mv workflow-templates/deploy.yml .github/workflows/deploy.yml
git rm workflow-templates/README.md

# 3. Commit and push
git commit -m "Enable CI and GitHub Pages workflows"
git push
```

Then, in the repository settings, set **Settings → Pages → Source** to
**GitHub Actions**. The next push to `main` will build and publish the site.

No edits to the workflow files are needed — `deploy.yml` derives the Pages base
path from the repository name automatically.
