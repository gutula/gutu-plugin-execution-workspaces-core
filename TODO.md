# Execution Workspaces Core TODO

**Maturity Tier:** `Hardened`

## Shipped Now

- Added durable execution workspace and runtime-service resources.
- Added realize, start, restart, and stop action contracts.
- Added `execution` control room surfaces for operator visibility.
- Added integration and migration tests for runtime-service lifecycle handling.

## Current Gaps

- Real infrastructure provisioning is not wired behind the control-plane contracts yet.
- Environment bootstrap and teardown are still modeled conceptually, not operationally.
- Isolation verification can go deeper.

## Recommended Next

- Add workspace bootstrap, teardown, and cleanup hooks.
- Add delegated runner and browser-service telemetry.
- Add policy checks for environment scope and isolation mode conformance.
- Add richer service health and crash-recovery evidence.

## Later / Optional

- Real container or VM providers once the control-plane contract is frozen.
- Multi-region execution placement and cost controls.
