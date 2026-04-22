import { loadJsonState, updateJsonState } from "@platform/ai-runtime";
import { normalizeActionInput } from "@platform/schema";

export type ExecutionWorkspaceRecord = {
  id: string;
  tenantId: string;
  label: string;
  status: "provisioned" | "running" | "paused" | "retired";
  ownerAgentProfileId: string | null;
  repoRef: string | null;
  previewUrl: string | null;
  policyProfile: string;
  isolationMode: "same-process" | "sandbox" | "worker";
  environmentScope: "dev" | "staging" | "prod";
  updatedAt: string;
};

export type RuntimeServiceRecord = {
  id: string;
  tenantId: string;
  workspaceId: string;
  label: string;
  kind: "preview" | "browser-runner" | "code-runner" | "webhook-listener";
  status: "stopped" | "starting" | "running" | "restarting" | "failed";
  endpoint: string | null;
  lastTransitionAt: string;
};

type ExecutionState = {
  workspaces: ExecutionWorkspaceRecord[];
  runtimeServices: RuntimeServiceRecord[];
};

export type RealizeWorkspaceInput = {
  tenantId: string;
  actorId: string;
  workspaceId: string;
  label: string;
  ownerAgentProfileId?: string | undefined;
  repoRef?: string | undefined;
  previewUrl?: string | undefined;
  policyProfile: string;
  isolationMode: ExecutionWorkspaceRecord["isolationMode"];
  environmentScope: ExecutionWorkspaceRecord["environmentScope"];
};

export type RuntimeServiceControlInput = {
  tenantId: string;
  actorId: string;
  workspaceId: string;
  serviceId: string;
};

const executionStateFile = "execution-workspaces-core.json";

function seedExecutionState(): ExecutionState {
  return {
    workspaces: [
      {
        id: "workspace:ops-review",
        tenantId: "tenant-platform",
        label: "Ops Review Workspace",
        status: "provisioned",
        ownerAgentProfileId: "agent-profile:ops-triage",
        repoRef: "git://workspaces/ops-review",
        previewUrl: "https://preview.example.com/ops-review",
        policyProfile: "policy.workspace.strict",
        isolationMode: "sandbox",
        environmentScope: "staging",
        updatedAt: "2026-04-22T12:40:00.000Z"
      }
    ],
    runtimeServices: [
      {
        id: "runtime-service:ops-review:preview",
        tenantId: "tenant-platform",
        workspaceId: "workspace:ops-review",
        label: "Preview Service",
        kind: "preview",
        status: "stopped",
        endpoint: "https://preview.example.com/ops-review",
        lastTransitionAt: "2026-04-22T12:40:00.000Z"
      }
    ]
  };
}

function loadExecutionState(): ExecutionState {
  return updateExecutionState(loadJsonState(executionStateFile, seedExecutionState));
}

function persistExecutionState(updater: (state: ExecutionState) => ExecutionState): ExecutionState {
  return updateExecutionState(updateJsonState(executionStateFile, seedExecutionState, updater));
}

export function listExecutionWorkspaces(): ExecutionWorkspaceRecord[] {
  return loadExecutionState().workspaces.sort((left, right) => left.label.localeCompare(right.label));
}

export function listRuntimeServices(): RuntimeServiceRecord[] {
  return loadExecutionState().runtimeServices.sort((left, right) => left.label.localeCompare(right.label));
}

export function getExecutionOverview() {
  const state = loadExecutionState();
  return {
    totals: {
      workspaces: state.workspaces.length,
      runningServices: state.runtimeServices.filter((service) => service.status === "running").length
    }
  };
}

export function realizeExecutionWorkspace(input: RealizeWorkspaceInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  persistExecutionState((state) => ({
    ...state,
    workspaces: upsertById(state.workspaces, {
      id: input.workspaceId,
      tenantId: input.tenantId,
      label: input.label,
      status: "provisioned",
      ownerAgentProfileId: input.ownerAgentProfileId ?? null,
      repoRef: input.repoRef ?? null,
      previewUrl: input.previewUrl ?? null,
      policyProfile: input.policyProfile,
      isolationMode: input.isolationMode,
      environmentScope: input.environmentScope,
      updatedAt: now
    }),
    runtimeServices: [
      ...state.runtimeServices.filter((service) => !service.id.startsWith(`runtime-service:${input.workspaceId}:`)),
      {
        id: `runtime-service:${input.workspaceId}:preview`,
        tenantId: input.tenantId,
        workspaceId: input.workspaceId,
        label: "Preview Service",
        kind: "preview",
        status: "stopped",
        endpoint: input.previewUrl ?? null,
        lastTransitionAt: now
      },
      {
        id: `runtime-service:${input.workspaceId}:code`,
        tenantId: input.tenantId,
        workspaceId: input.workspaceId,
        label: "Code Runner",
        kind: "code-runner",
        status: "stopped",
        endpoint: null,
        lastTransitionAt: now
      }
    ]
  }));

  return {
    ok: true as const,
    workspaceId: input.workspaceId,
    status: "provisioned" as const
  };
}

export function startRuntimeService(input: RuntimeServiceControlInput) {
  return updateRuntimeServiceStatus(input, "running");
}

export function restartRuntimeService(input: RuntimeServiceControlInput) {
  return updateRuntimeServiceStatus(input, "restarting");
}

export function stopRuntimeService(input: RuntimeServiceControlInput) {
  return updateRuntimeServiceStatus(input, "stopped");
}

function updateRuntimeServiceStatus(input: RuntimeServiceControlInput, status: RuntimeServiceRecord["status"]) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  persistExecutionState((state) => ({
    ...state,
    runtimeServices: state.runtimeServices.map((service) =>
      service.id === input.serviceId && service.workspaceId === input.workspaceId && service.tenantId === input.tenantId
        ? {
            ...service,
            status,
            lastTransitionAt: now
          }
        : service
    ),
    workspaces: state.workspaces.map((workspace) =>
      workspace.id === input.workspaceId && workspace.tenantId === input.tenantId
        ? {
            ...workspace,
            status: status === "running" ? "running" : status === "stopped" ? "paused" : workspace.status,
            updatedAt: now
          }
        : workspace
    )
  }));

  return {
    ok: true as const,
    serviceId: input.serviceId,
    status
  };
}

function updateExecutionState(state: ExecutionState): ExecutionState {
  return {
    workspaces: state.workspaces.map((workspace) => ({
      ...workspace
    })),
    runtimeServices: state.runtimeServices.map((service) => ({
      ...service
    }))
  };
}

function upsertById<T extends { id: string }>(items: T[], item: T): T[] {
  const remaining = items.filter((entry) => entry.id !== item.id);
  return [...remaining, item];
}
