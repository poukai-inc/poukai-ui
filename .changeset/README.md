# Changesets

Run `pnpm changeset` (or `npx changeset`) to record a release entry.
Run `pnpm release` to publish to the private registry.

A Husky pre-push hook is installed to protect pushes to `main`.
It prevents a push if there are new package changes but no generated `.changeset/` file in the pushed commit.
