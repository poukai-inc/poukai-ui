---
id: "0006"
title: "Scope rename: @poukai/ui → @poukai-inc/ui"
date: "2026-05-14"
status: accepted
tags: [publishing, npm, github-packages, package-json]
---

The npm scope `@poukai` was already claimed by an unrelated user, so GitHub Packages would reject any publish under that scope. The GitHub org was renamed from `Pouk-AI-INC` to `poukai-inc` to align with a scope we could own; GitHub Packages enforces that the npm scope must match the owner login exactly. Additionally, `"private": true` in the root `package.json` caused `changeset publish` to silently skip the package with no error — removing that flag was a prerequisite for any publish to succeed.

Rename the scope to `@poukai-inc/ui`, remove `"private": true` from `package.json`, and re-point all internal imports and documentation. First successful publish under the new scope is `0.2.0`.

Consumers must update their import paths from `@poukai/ui` to `@poukai-inc/ui`. No API surface changes; purely a distribution-coordinate change. Any CI or lockfile caches keyed on the old scope name will miss and must be refreshed.
