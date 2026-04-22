import { defineAction } from "@platform/schema";
import { z } from "zod";

import {
  realizeExecutionWorkspace,
  restartRuntimeService,
  startRuntimeService,
  stopRuntimeService
} from "../services/main.service";

export const realizeExecutionWorkspaceAction = defineAction({
  id: "execution.workspaces.realize",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    workspaceId: z.string().min(2),
    label: z.string().min(2),
    ownerAgentProfileId: z.string().min(2).optional(),
    repoRef: z.string().min(2).optional(),
    previewUrl: z.string().min(2).optional(),
    policyProfile: z.string().min(2),
    isolationMode: z.enum(["same-process", "sandbox", "worker"]),
    environmentScope: z.enum(["dev", "staging", "prod"])
  }),
  output: z.object({
    ok: z.literal(true),
    workspaceId: z.string(),
    status: z.literal("provisioned")
  }),
  permission: "execution.workspaces.realize",
  idempotent: true,
  audit: true,
  handler: ({ input }) => realizeExecutionWorkspace(input)
});

export const startRuntimeServiceAction = defineAction({
  id: "execution.runtime-services.start",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    workspaceId: z.string().min(2),
    serviceId: z.string().min(2)
  }),
  output: z.object({
    ok: z.literal(true),
    serviceId: z.string(),
    status: z.literal("running")
  }),
  permission: "execution.runtime-services.start",
  idempotent: true,
  audit: true,
  handler: ({ input }) => startRuntimeService(input)
});

export const restartRuntimeServiceAction = defineAction({
  id: "execution.runtime-services.restart",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    workspaceId: z.string().min(2),
    serviceId: z.string().min(2)
  }),
  output: z.object({
    ok: z.literal(true),
    serviceId: z.string(),
    status: z.literal("restarting")
  }),
  permission: "execution.runtime-services.restart",
  idempotent: true,
  audit: true,
  handler: ({ input }) => restartRuntimeService(input)
});

export const stopRuntimeServiceAction = defineAction({
  id: "execution.runtime-services.stop",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    workspaceId: z.string().min(2),
    serviceId: z.string().min(2)
  }),
  output: z.object({
    ok: z.literal(true),
    serviceId: z.string(),
    status: z.literal("stopped")
  }),
  permission: "execution.runtime-services.stop",
  idempotent: true,
  audit: true,
  handler: ({ input }) => stopRuntimeService(input)
});

export const executionActions = [
  realizeExecutionWorkspaceAction,
  startRuntimeServiceAction,
  restartRuntimeServiceAction,
  stopRuntimeServiceAction
] as const;
