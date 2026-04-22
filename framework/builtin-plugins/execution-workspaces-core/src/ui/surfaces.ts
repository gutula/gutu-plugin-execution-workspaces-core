import { defineUiSurface } from "@platform/ui-shell";

import { ExecutionWorkspacesAdminPage } from "./admin/main.page";

export const uiSurface = defineUiSurface({
  embeddedPages: [
    {
      shell: "admin",
      route: "/admin/execution",
      component: ExecutionWorkspacesAdminPage,
      permission: "execution.workspaces.read"
    }
  ],
  widgets: []
});
