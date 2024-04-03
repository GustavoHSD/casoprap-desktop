import { Outlet } from "react-router-dom";
import { AppNavBar } from "../../components/navbar";

export const Root = () => {
  return (
    <>
      <AppNavBar />
      <Outlet />
    </>
  );
};
