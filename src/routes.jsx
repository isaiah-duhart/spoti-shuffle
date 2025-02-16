import App from "./App";
import Profile from "./sections/Profile/Profile";
import ErrorPage from "./sections/ErrorPage/ErrorPage";

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