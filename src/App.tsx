import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  Link,
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from "react-router-dom";
import { Root } from "./pages/root";
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
        Component: () => <Navigate to="volunteers" replace />,
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
      Algo de errado aconteceu, clique <Link to="/">aqui</Link> para voltar ao inicio
    </div>
  );
}
export default App;
