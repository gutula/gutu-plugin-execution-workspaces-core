import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const executionWorkspaces = pgTable("execution_workspaces", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull(),
  ownerAgentProfileId: text("owner_agent_profile_id"),
  repoRef: text("repo_ref"),
  previewUrl: text("preview_url"),
  policyProfile: text("policy_profile").notNull(),
  isolationMode: text("isolation_mode").notNull(),
  environmentScope: text("environment_scope").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const executionRuntimeServices = pgTable("execution_runtime_services", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  workspaceId: text("workspace_id").notNull(),
  label: text("label").notNull(),
  kind: text("kind").notNull(),
  status: text("status").notNull(),
  endpoint: text("endpoint"),
  lastTransitionAt: timestamp("last_transition_at").notNull().defaultNow()
});
