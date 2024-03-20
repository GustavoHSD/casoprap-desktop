import { Outlet } from "react-router-dom";
import { AppNavBar } from "../../components/navbar";

export const Home = () => {
  return (
    <>
      <AppNavBar />
      <Outlet />
    </>
  );
};
