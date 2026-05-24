/**
 * Test harnesses for PricingTable CT tests.
 *
 * Playwright CT cannot mount wrapper components defined inline in test
 * files. Shared fixtures live here.
 */
import { PricingTable } from "./PricingTable";
import { PriceTier } from "../../molecules/PriceTier";

export const ThreeTiers = () => (
  <PricingTable>
    <PriceTier name="Starter" price="$0" cadence="free forever" />
    <PriceTier featured name="Pro" price="$49" cadence="per month" />
    <PriceTier name="Enterprise" price="Custom" cadence="contact us" />
  </PricingTable>
);
