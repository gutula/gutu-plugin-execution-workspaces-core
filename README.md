# Execution Workspaces Core

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

Governed run and issue workspaces with runtime service lifecycle controls for preview, code, and operator-facing execution environments.

![Maturity: Hardened](https://img.shields.io/badge/Maturity-Hardened-0f766e) ![Verification: Docs+Build+Typecheck+Lint+Test+Contracts+Integration+Migrations](https://img.shields.io/badge/Verification-Docs%2BBuild%2BTypecheck%2BLint%2BTest%2BContracts%2BIntegration%2BMigrations-6b7280) ![DB: postgres+sqlite](https://img.shields.io/badge/DB-postgres%2Bsqlite-2563eb) ![Integration Model: Actions+Resources+UI](https://img.shields.io/badge/Integration%20Model-Actions%2BResources%2BUI-6b7280)

**Maturity Tier:** `Hardened`

## Part Of The Gutu Stack

| Aspect | Value |
| --- | --- |
| Repo kind | First-party plugin |
| Domain group | AI Systems |
| Primary focus | realized workspaces, runtime services, preview and runner controls |
| Best when | You want governed execution environments instead of opaque sidecar services tied to agent runs. |
| Composes through | Actions+Resources+UI |

- `execution-workspaces-core` is the control plane for workspaces and runtime services used by governed runs and recovery flows.
- It keeps environment scope, isolation mode, and service lifecycle visible to operators and higher-level packs.

## What It Does Now

- Exports 4 governed actions: `execution.workspaces.realize`, `execution.runtime-services.start`, `execution.runtime-services.restart`, `execution.runtime-services.stop`.
- Owns 2 public resources: `execution.workspaces`, `execution.runtime-services`.
- Adds an `execution` workspace with a control room for active workspaces and running services.
- Persists isolation mode, environment scope, repo reference, and runtime-service status for each workspace.
- Provides the execution-plane surface referenced by Company Builder and future out-of-process runner handoff flows.

## Maturity

`execution-workspaces-core` is `Hardened` because workspace realization and runtime service lifecycle are durable, operator-visible, migration-covered, and validated in dedicated integration tests.

## Verified Capability Summary

- Group: **AI Systems**
- Verification surface: **Docs+Build+Typecheck+Lint+Test+Contracts+Integration+Migrations**
- Tests discovered: **6** files across unit, contract, integration, and migration lanes
- Integration model: **Actions+Resources+UI**
- Database support: **postgres + sqlite**

## Dependency And Compatibility Summary

| Field | Value |
| --- | --- |
| Package | `@plugins/execution-workspaces-core` |
| Manifest ID | `execution-workspaces-core` |
| Repo | `gutu-plugin-execution-workspaces-core` |
| Depends On | `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core` |
| Requested Capabilities | `ui.register.admin`, `api.rest.mount`, `data.write.execution` |
| Provided Capabilities | `execution.workspaces`, `execution.runtime-services` |
| Runtime | bun>=1.3.12 |
| Database | postgres, sqlite |
| Integration Model | Actions+Resources+UI |

## Capability Matrix

| Surface | Count | Details |
| --- | --- | --- |
| Actions | 4 | `execution.workspaces.realize`, `execution.runtime-services.start`, `execution.runtime-services.restart`, `execution.runtime-services.stop` |
| Resources | 2 | `execution.workspaces`, `execution.runtime-services` |
| Workspaces | 1 | `execution` |
| Runtime Controls | 3 | start, restart, stop |
| UI | Present | control room, admin commands |

## Quick Start For Integrators

Use this repo inside a compatible Gutu workspace so its `workspace:*` dependencies resolve truthfully.

```bash
bun install
bun run build
bun run test
bun run docs:check
```

```ts
import {
  manifest,
  realizeExecutionWorkspaceAction,
  restartRuntimeServiceAction,
  ExecutionWorkspaceResource,
  RuntimeServiceResource
} from "@plugins/execution-workspaces-core";

console.log(manifest.id);
console.log(realizeExecutionWorkspaceAction.id);
console.log(restartRuntimeServiceAction.id);
console.log(ExecutionWorkspaceResource.id, RuntimeServiceResource.id);
```

## Current Test Coverage

- Root verification scripts: `bun run build`, `bun run typecheck`, `bun run lint`, `bun run test`, `bun run test:contracts`, `bun run test:integration`, `bun run test:migrations`, `bun run test:unit`, `bun run docs:check`
- Unit files: 2
- Contracts files: 2
- Integration files: 1
- Migrations files: 1

## Known Boundaries And Non-Goals

- This plugin models workspace and runtime-service state; it does not provision real container or VM infrastructure yet.
- Browser automation and external runner plumbing remain future composition layers on top of these contracts.
- Secret injection and connector auth remain owned by `integration-core`.

## Recommended Next Milestones

- Add environment bootstrap and teardown contracts for realized workspaces.
- Add browser-runner and code-runner lifecycle telemetry.
- Expand workspace handoff evidence for `ai-core` runner delegation.
- Add isolation verification and environment-policy conformance checks.

## More Docs

See [DEVELOPER.md](./DEVELOPER.md), [TODO.md](./TODO.md), [SECURITY.md](./SECURITY.md), and [CONTRIBUTING.md](./CONTRIBUTING.md).
