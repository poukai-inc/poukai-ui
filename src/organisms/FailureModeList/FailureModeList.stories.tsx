import type { Story } from "@ladle/react";
import { FailureModeList } from "./FailureModeList";
import { FailureMode } from "../../molecules/FailureMode";

export default {
  title: "Organisms/FailureModeList",
};

export const Default: Story = () => (
  <FailureModeList heading="Common failure modes">
    <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
      <p>Most teams stop here. The demo dazzles; the production loop never closes.</p>
    </FailureMode>
    <FailureMode index={2} title="Evals as afterthought.">
      <p>Shipped without a measurement loop. No signal means no improvement.</p>
    </FailureMode>
    <FailureMode index={3} title="Context window as database.">
      <p>Stuffing the prompt with all available data instead of retrieving what is relevant.</p>
    </FailureMode>
  </FailureModeList>
);

export const HowThisBreaks: Story = () => (
  <FailureModeList
    eyebrow="Where things fail"
    heading="How this breaks"
    lede="The most common failure modes we see in AI product teams trying to ship to production."
  >
    <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
      <p>Most teams stop here. The demo dazzles; the production loop never closes.</p>
    </FailureMode>
    <FailureMode index={2} title="Evals as afterthought.">
      <p>Shipped without a measurement loop. No signal means no improvement cycle.</p>
    </FailureMode>
    <FailureMode index={3} title="Context window as database.">
      <p>Stuffing the prompt with all available data instead of retrieving what is relevant.</p>
    </FailureMode>
    <FailureMode index={4} title="Single-model dependency.">
      <p>Coupling hard to one provider creates fragility when APIs change or costs spike.</p>
    </FailureMode>
  </FailureModeList>
);

export const TightPadding: Story = () => (
  <FailureModeList heading="Failure modes" size="tight">
    <FailureMode index={1} title="Missing feedback signal.">
      <p>No thumbs up/down, no implicit signals captured. Improvement is impossible.</p>
    </FailureMode>
    <FailureMode index={2} title="Latency ignored until production.">
      <p>P99 latency is a product experience problem, not an infrastructure footnote.</p>
    </FailureMode>
  </FailureModeList>
);

export const NoHeading: Story = () => (
  <FailureModeList>
    <FailureMode index={1} title="Prompt engineering as strategy.">
      <p>Brittle. Undocumented. Impossible to regression-test at scale.</p>
    </FailureMode>
    <FailureMode index={2} title="Fine-tuning without a dataset.">
      <p>Fine-tuning amplifies signal. No signal means amplified noise.</p>
    </FailureMode>
  </FailureModeList>
);
