import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("actions", [route("set-theme", "routes/actions/set-theme.ts")]),
] satisfies RouteConfig;
