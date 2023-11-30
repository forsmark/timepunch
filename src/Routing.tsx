import {
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  redirect,
} from "@tanstack/react-router";

import { useAuthStore } from "./utils/auth";
import { usePunchStore } from "./utils/punches";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import PunchIn from "./pages/PunchIn";
import PunchOut from "./pages/PunchOut";

function Root() {
  return (
    <div className="flex flex-col items-center w-full">
      <Navbar />
      <Outlet />
    </div>
  );
}

const rootRoute = new RootRoute({
  component: Root,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
  beforeLoad: () => {
    const signedIn = useAuthStore.getState().signedIn;
    if (!signedIn) {
      throw redirect(loginRoute);
    }
  },
});

const punchInRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/punch/in",
  component: PunchIn,
  beforeLoad: () => {
    const signedIn = useAuthStore.getState().signedIn;
    if (!signedIn) {
      throw redirect(loginRoute);
    }

    const punchedIn = usePunchStore.getState().punchedIn;

    if (punchedIn) {
      throw redirect(homeRoute);
    }
  },
});

const punchOutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/punch/out",
  component: PunchOut,
  beforeLoad: () => {
    const signedIn = useAuthStore.getState().signedIn;
    if (!signedIn) {
      throw redirect(loginRoute);
    }
  },
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  homeRoute,
  punchInRoute,
  punchOutRoute,
]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const Routing = () => <RouterProvider router={router} />;
