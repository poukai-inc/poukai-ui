---
"@poukai-inc/ui": minor
---

feat(molecule): add TimelineItem

Adds the `TimelineItem` molecule — a single entry in a sequential chronological list, composing `Time`, `Heading`, and `Text` atoms into a date + title + optional-body row with a left-rail marker dot and optional connector line.

Props: `date` (required ISO 8601 string), `title` (required ReactNode), `body` (optional ReactNode), `connector` (boolean, default `true`), `headingLevel` (HeadingLevel, default `"h3"`).

Export path: `@poukai-inc/ui` (barrel) and `@poukai-inc/ui/molecules/TimelineItem` (subpath). Zero new tokens.
