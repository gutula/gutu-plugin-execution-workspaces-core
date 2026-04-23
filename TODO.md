# Execution Workspaces Core TODO

**Maturity Tier:** `Hardened`

## Shipped Now

- Exports 4 governed actions: `execution.workspaces.realize`, `execution.runtime-services.start`, `execution.runtime-services.restart`, `execution.runtime-services.stop`.
- Owns 2 resource contracts: `execution.workspaces`, `execution.runtime-services`.
- Adds richer admin workspace contributions on top of the base UI surface.
- Defines a durable data schema contract even though no explicit SQL helper module is exported.

## Current Gaps

- No standalone plugin-owned event, job, or workflow catalog is exported yet; compose it through actions, resources, and the surrounding Gutu runtime.
- The repo does not yet export a domain parity catalog with owned entities, reports, settings surfaces, and exception queues.

## Recommended Next

- Deepen runtime diagnostics and lifecycle reconciliation as more AI and automation flows depend on long-lived execution environments.
- Add clearer infrastructure handoff guidance where external runtimes or clusters start backing these workspaces.
- Add deeper provider, persistence, or evaluation integrations only where the shipped control-plane contracts already prove stable.
- Expand operator diagnostics and release gating where the current lifecycle already exposes strong evidence paths.
- Promote important downstream reactions into explicit commands, jobs, or workflow steps instead of relying on implicit coupling.

## Later / Optional

- More connector breadth, richer evaluation libraries, and domain-specific copilots after the baseline contracts settle.
