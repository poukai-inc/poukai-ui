---
id: "0010"
title: "Proposal-loop architecture for cross-repo DS consumption"
date: "2026-05-14"
status: accepted
tags: [workflow, github-actions, cross-repo, automation]
---

Consumer repos (e.g. `poukai-inc/pouk.ai`) need a governed path to request design-system changes without bypassing brand review or creating uncoordinated forks. An ungated bot loop would let consumers land breaking visual changes without a human in the approval chain.

Consumers open issues in `poukai-inc/poukai-ui` with the label `proposal:from-consumer` as provenance metadata. A human reviewer adds `proposal:approved` to gate the producer Claude Code session; the session authenticates via OAuth (Max subscription, not API credits) and requires an explicit `claude_args: --allowedTools` allowlist for Bash. The session ends by opening a PR that `Closes #N`. Post-publish, a `repository_dispatch` event fires to the consumer repo to open a draft version-bump PR.

The human-approval gate (`proposal:approved`) is load-bearing — removing it would make the loop fully automated and ungoverned. The `--allowedTools` allowlist for Bash must be kept narrow; scope creep there is a security surface. The `repository_dispatch` draft PR on the consumer side is a draft by design; a human must promote it to avoid silent dependency upgrades in production.
