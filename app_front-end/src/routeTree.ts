import { rootRoute } from "./routes/__root";
import { dashboardRoute } from "./routes/dashboard";
import { indexRoute } from "./routes/index";
import { loginRoute } from "./routes/login";
import { profileRoute } from "./routes/profile";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  profileRoute,
]);
