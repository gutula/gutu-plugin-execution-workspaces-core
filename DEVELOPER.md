# Execution Workspaces Core Developer Guide

**Maturity Tier:** `Hardened`

## Purpose And Architecture Role

`execution-workspaces-core` is the workspace and runtime-service control plane for governed run execution. It gives the platform a durable place to represent realized workspaces, preview services, code runners, and future delegated runtime environments.

## Repo Map

| Path | Purpose |
| --- | --- |
| `framework/builtin-plugins/execution-workspaces-core` | Publishable plugin package. |
| `framework/builtin-plugins/execution-workspaces-core/src` | Actions, resources, services, policies, and admin UI exports. |
| `framework/builtin-plugins/execution-workspaces-core/tests` | Unit, contract, integration, and migration coverage. |
| `framework/builtin-plugins/execution-workspaces-core/db/schema.ts` | Durable schema for workspaces and runtime services. |
| `framework/builtin-plugins/execution-workspaces-core/docs` | Internal supporting domain docs for execution environments. |

## Manifest Contract

| Field | Value |
| --- | --- |
| Package Name | `@plugins/execution-workspaces-core` |
| Manifest ID | `execution-workspaces-core` |
| Display Name | Execution Workspaces Core |
| Kind | `plugin` |
| Trust Tier | `first-party` |
| Review Tier | `R1` |

## Dependency Graph And Capability Requests

| Field | Value |
| --- | --- |
| Depends On | `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core` |
| Requested Capabilities | `ui.register.admin`, `api.rest.mount`, `data.write.execution` |
| Provides Capabilities | `execution.workspaces`, `execution.runtime-services` |
| Owns Data | `execution.workspaces`, `execution.runtime-services` |

## Public Integration Surfaces

| Type | ID | Notes |
| --- | --- | --- |
| Action | `execution.workspaces.realize` | Creates or updates a governed workspace record. |
| Action | `execution.runtime-services.start` | Starts a runtime service for a workspace. |
| Action | `execution.runtime-services.restart` | Restarts a runtime service and updates lifecycle state. |
| Action | `execution.runtime-services.stop` | Stops a runtime service and persists the transition. |
| Resource | `execution.workspaces` | Realized workspace inventory and policy posture. |
| Resource | `execution.runtime-services` | Runtime service lifecycle state. |
| Workspace | `execution` | Operator-facing execution control room. |

## Hooks, Events, And Orchestration

- No hook bus is exported.
- Higher-level orchestration systems reference these records to decide where runs, previews, and recovery work should execute.
- Runtime-service lifecycle stays explicit so later out-of-process handoff can reuse the same public contract.

## Storage, Schema, And Migration Notes

- Schema file: `framework/builtin-plugins/execution-workspaces-core/db/schema.ts`
- Durable records cover execution workspaces and runtime services.
- Seed data provides one ops review workspace with preview and code services for regression coverage.

## Failure Modes And Recovery

- Unknown workspace or service references fail before state is mutated.
- Restart transitions refresh service status and last-transition time for operator visibility.
- Stopping a service also updates the workspace summary so the control room does not drift.
- Cross-tenant service changes are rejected by service lookups and permission checks.

## Mermaid Flows

```mermaid
flowchart LR
  realize["Realize workspace"] --> start["Start runtime service"]
  start --> restart["Restart service"]
  restart --> stop["Stop service"]
  stop --> control["Execution control room"]
```

## Integration Recipes

```ts
import {
  realizeExecutionWorkspaceAction,
  startRuntimeServiceAction,
  ExecutionWorkspaceResource,
  RuntimeServiceResource
} from "@plugins/execution-workspaces-core";

console.log(realizeExecutionWorkspaceAction.id);
console.log(startRuntimeServiceAction.id);
console.log(ExecutionWorkspaceResource.id, RuntimeServiceResource.id);
```

## Test Matrix

- Root scripts: `bun run build`, `bun run typecheck`, `bun run lint`, `bun run test`, `bun run test:contracts`, `bun run test:integration`, `bun run test:migrations`, `bun run test:unit`, `bun run docs:check`
- Unit focus: workspace realization and runtime-service lifecycle
- Contract focus: execution workspace, route exposure, command visibility
- Integration focus: runtime-service control flow

## Current Truth And Recommended Next

- Current truth: `execution-workspaces-core` is a durable control-plane model for execution environments, not yet a real infrastructure provisioner.
- Recommended next: add environment bootstrap hooks, isolation verification, and delegated runner telemetry.
