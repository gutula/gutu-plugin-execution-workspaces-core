import {
  defineAdminNav,
  defineCommand,
  definePage,
  defineWorkspace,
  type AdminContributionRegistry
} from "@platform/admin-contracts";

import { ExecutionWorkspacesAdminPage } from "./admin/main.page";

export const adminContributions: Pick<AdminContributionRegistry, "workspaces" | "nav" | "pages" | "commands"> = {
  workspaces: [
    defineWorkspace({
      id: "execution",
      label: "Execution",
      icon: "box",
      description: "Run workspaces, preview services, and browser/code runtime lifecycle.",
      permission: "execution.workspaces.read",
      homePath: "/admin/execution",
      quickActions: ["execution.open.control-room"]
    })
  ],
  nav: [
    defineAdminNav({
      workspace: "execution",
      group: "control-room",
      items: [
        {
          id: "execution.overview",
          label: "Workspaces",
          icon: "box",
          to: "/admin/execution",
          permission: "execution.workspaces.read"
        }
      ]
    })
  ],
  pages: [
    definePage({
      id: "execution.page",
      kind: "dashboard",
      route: "/admin/execution",
      label: "Execution Workspaces",
      workspace: "execution",
      group: "control-room",
      permission: "execution.workspaces.read",
      component: ExecutionWorkspacesAdminPage
    })
  ],
  commands: [
    defineCommand({
      id: "execution.open.control-room",
      label: "Open Execution Workspaces",
      permission: "execution.workspaces.read",
      href: "/admin/execution",
      keywords: ["execution", "workspaces", "runtime"]
    })
  ]
};
