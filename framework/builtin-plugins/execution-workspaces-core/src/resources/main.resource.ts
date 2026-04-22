import { defineResource } from "@platform/schema";
import { z } from "zod";

import { executionRuntimeServices, executionWorkspaces } from "../../db/schema";

export const ExecutionWorkspaceResource = defineResource({
  id: "execution.workspaces",
  description: "Governed realized workspaces for runs, issues, and preview environments.",
  businessPurpose: "Track isolation posture, environment scope, policy profile, and preview ownership for execution spaces.",
  table: executionWorkspaces,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    label: z.string().min(2),
    status: z.enum(["provisioned", "running", "paused", "retired"]),
    ownerAgentProfileId: z.string().nullable(),
    repoRef: z.string().nullable(),
    previewUrl: z.string().nullable(),
    policyProfile: z.string().min(2),
    isolationMode: z.enum(["same-process", "sandbox", "worker"]),
    environmentScope: z.enum(["dev", "staging", "prod"]),
    updatedAt: z.string()
  }),
  fields: {
    label: { searchable: true, sortable: true, label: "Workspace" },
    status: { filter: "select", label: "Status" },
    policyProfile: { searchable: true, sortable: true, label: "Policy" },
    isolationMode: { filter: "select", label: "Isolation" },
    environmentScope: { filter: "select", label: "Environment" },
    updatedAt: { sortable: true, label: "Updated" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["label", "status", "policyProfile", "isolationMode", "environmentScope", "updatedAt"]
  },
  portal: { enabled: false }
});

export const RuntimeServiceResource = defineResource({
  id: "execution.runtime-services",
  description: "Lifecycle state for preview and runner services attached to execution workspaces.",
  businessPurpose: "Expose start, restart, stop, and failure posture for runtime services.",
  table: executionRuntimeServices,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    workspaceId: z.string().min(2),
    label: z.string().min(2),
    kind: z.enum(["preview", "browser-runner", "code-runner", "webhook-listener"]),
    status: z.enum(["stopped", "starting", "running", "restarting", "failed"]),
    endpoint: z.string().nullable(),
    lastTransitionAt: z.string()
  }),
  fields: {
    workspaceId: { searchable: true, sortable: true, label: "Workspace" },
    label: { searchable: true, sortable: true, label: "Service" },
    kind: { filter: "select", label: "Kind" },
    status: { filter: "select", label: "Status" },
    lastTransitionAt: { sortable: true, label: "Last Transition" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["workspaceId", "label", "kind", "status", "lastTransitionAt"]
  },
  portal: { enabled: false }
});

export const executionResources = [ExecutionWorkspaceResource, RuntimeServiceResource] as const;
