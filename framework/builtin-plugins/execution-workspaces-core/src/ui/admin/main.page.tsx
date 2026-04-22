import React from "react";

import { getExecutionOverview, listExecutionWorkspaces, listRuntimeServices } from "../../services/main.service";

export function ExecutionWorkspacesAdminPage() {
  const overview = getExecutionOverview();
  const workspaces = listExecutionWorkspaces().slice(0, 4);
  const services = listRuntimeServices().slice(0, 4);

  return React.createElement(
    "section",
    null,
    React.createElement("h1", null, "Execution Workspaces"),
    React.createElement("p", null, `${overview.totals.workspaces} workspaces and ${overview.totals.runningServices} running services.`),
    React.createElement(
      "ul",
      null,
      ...workspaces.map((workspace) =>
        React.createElement("li", { key: workspace.id }, `${workspace.label} - ${workspace.isolationMode} - ${workspace.environmentScope}`)
      )
    ),
    React.createElement("h2", null, "Runtime Services"),
    React.createElement(
      "ul",
      null,
      ...services.map((service) =>
        React.createElement("li", { key: service.id }, `${service.label} - ${service.kind} - ${service.status}`)
      )
    )
  );
}
