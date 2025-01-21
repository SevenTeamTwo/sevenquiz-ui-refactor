import { type RouteConfig, layout, index, prefix, route } from "@react-router/dev/routes";

export default [
  layout("routes/main.layout.tsx", [index("routes/main.index.tsx"), route("lobby/:id", "routes/main.lobby.$id.tsx")]),
  ...prefix("actions", [
    route("set-theme", "routes/actions/set-theme.ts"),
    route("create-lobby", "routes/actions/create-lobby.ts"),
  ]),
] satisfies RouteConfig;
