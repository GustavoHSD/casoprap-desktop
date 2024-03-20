import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  Link,
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from "react-router-dom";
import { Home } from "./pages/home";
import { Volunteers } from "./pages/volunteers";
import { Animals } from "./pages/animals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/volunteers",
        element: <Volunteers />,
        index: true,
      },
      {
        path: "/animals",
        element: <Animals />,
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
  // Uncaught ReferenceError: path is not defined
  return (
    <div>
      Somthing went wrong, click <Link to="/">here</Link> to go back to the home page
    </div>
  );
}
export default App;
