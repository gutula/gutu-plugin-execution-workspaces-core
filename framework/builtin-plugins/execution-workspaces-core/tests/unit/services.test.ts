import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  listExecutionWorkspaces,
  listRuntimeServices,
  realizeExecutionWorkspace,
  restartRuntimeService,
  startRuntimeService,
  stopRuntimeService
} from "../../src/services/main.service";

describe("execution-workspaces-core services", () => {
  let stateDir = "";
  const previousStateDir = process.env.GUTU_STATE_DIR;

  beforeEach(() => {
    stateDir = mkdtempSync(join(tmpdir(), "gutu-execution-state-"));
    process.env.GUTU_STATE_DIR = stateDir;
  });

  afterEach(() => {
    rmSync(stateDir, { recursive: true, force: true });
    if (previousStateDir === undefined) {
      delete process.env.GUTU_STATE_DIR;
      return;
    }
    process.env.GUTU_STATE_DIR = previousStateDir;
  });

  it("realizes workspaces and controls runtime services", () => {
    realizeExecutionWorkspace({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      workspaceId: "workspace:release-canary",
      label: "Release Canary Workspace",
      ownerAgentProfileId: "agent-profile:release-agent",
      repoRef: "git://workspaces/release-canary",
      previewUrl: "https://preview.example.com/release-canary",
      policyProfile: "policy.workspace.strict",
      isolationMode: "sandbox",
      environmentScope: "staging"
    });

    const serviceId = "runtime-service:workspace:release-canary:preview";
    const started = startRuntimeService({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      workspaceId: "workspace:release-canary",
      serviceId
    });
    const restarted = restartRuntimeService({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      workspaceId: "workspace:release-canary",
      serviceId
    });
    const stopped = stopRuntimeService({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      workspaceId: "workspace:release-canary",
      serviceId
    });

    expect(started.status).toBe("running");
    expect(restarted.status).toBe("restarting");
    expect(stopped.status).toBe("stopped");
    expect(listExecutionWorkspaces().some((workspace) => workspace.id === "workspace:release-canary")).toBe(true);
    expect(listRuntimeServices().some((service) => service.id === serviceId)).toBe(true);
  });
});
