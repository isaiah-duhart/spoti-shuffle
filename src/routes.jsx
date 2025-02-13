import App from "./App";
import Profile from "./Profile";
import ErrorPage from "./ErrorPage";
import { element } from "prop-types";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
];

export default routes;