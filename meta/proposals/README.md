# Site → DS proposals

Inbound requests for new primitives or extensions to existing ones. Filed here by the site team or the `pouk-ai-pm` agent; triaged by the `poukai-design` agent per §5 of its system prompt.

Each proposal is one file: `meta/proposals/<short-name>.md`. After triage it ends with one of three resolutions:

1. **Compose existing primitives** — reply in the proposal with the composition; no DS change.
2. **Extend an existing primitive** — update the relevant `meta/design/<component>.md` with new variant or prop intent; link from this proposal.
3. **Create a new primitive** — write a fresh `meta/design/<component>.md`; link from this proposal.

Hand-off to `poukai-ds-engineer` only once the design spec is `Approved`.
