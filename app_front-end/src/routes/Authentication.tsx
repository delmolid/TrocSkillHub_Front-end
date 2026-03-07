import type { RouteConfig } from "@react-router/dev/routes";
import { route } from "@react-router/dev/routes";

export default [
  route("auth/login", "routes/Authentication.tsx"),
] satisfies RouteConfig;
