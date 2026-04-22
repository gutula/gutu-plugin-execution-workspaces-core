import { definePackage } from "@platform/kernel";

export default definePackage({
  id: "execution-workspaces-core",
  kind: "plugin",
  version: "0.1.0",
  displayName: "Execution Workspaces Core",
  description: "Governed run and issue workspaces with preview, browser, code, and runtime service lifecycle controls.",
  extends: [],
  dependsOn: [
    "auth-core",
    "org-tenant-core",
    "role-policy-core",
    "audit-core"
  ],
  optionalWith: [],
  conflictsWith: [],
  providesCapabilities: ["execution.workspaces", "execution.runtime-services"],
  requestedCapabilities: [
    "ui.register.admin",
    "api.rest.mount",
    "data.write.execution"
  ],
  ownsData: ["execution.workspaces", "execution.runtime-services"],
  extendsData: [],
  slotClaims: [],
  trustTier: "first-party",
  reviewTier: "R1",
  isolationProfile: "same-process-trusted",
  compatibility: {
    framework: "^0.1.0",
    runtime: "bun>=1.3.12",
    db: ["postgres", "sqlite"]
  }
});
