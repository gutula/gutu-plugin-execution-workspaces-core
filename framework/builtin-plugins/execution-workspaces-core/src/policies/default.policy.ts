import { definePolicy } from "@platform/permissions";

export const executionPolicy = definePolicy({
  id: "execution-workspaces-core.default",
  rules: [
    {
      permission: "execution.workspaces.read",
      allowIf: ["role:admin", "role:operator", "role:support"]
    },
    {
      permission: "execution.workspaces.realize",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "execution.runtime-services.read",
      allowIf: ["role:admin", "role:operator", "role:support"]
    },
    {
      permission: "execution.runtime-services.start",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "execution.runtime-services.restart",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "execution.runtime-services.stop",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    }
  ]
});
