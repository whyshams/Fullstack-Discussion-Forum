import { Outlet } from "react-router-dom";
import Header from "./Header";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <>
      <ToastContainer />

      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
