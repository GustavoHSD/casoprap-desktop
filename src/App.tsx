import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  Link,
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from "react-router-dom";
import { Root } from "./pages/root";
import { Home } from "./pages/home";
import { Volunteers } from "./pages/volunteers";
import { Animals } from "./pages/animals";
import { Resource } from "./pages/resources";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: Root,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "volunteers",
        Component: Volunteers,
      },
      {
        path: "animals",
        Component: Animals,
      },
      {
        path: "resources",
        Component: Resource,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  return (
    <div>
      Somthing went wrong, click <Link to="/">here</Link> to go back to the home
      page
    </div>
  );
}
export default App;
