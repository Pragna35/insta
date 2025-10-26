import Sidebar from "@/components/Sidebar";

import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Sidebar />
      <div className="">
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default MainLayout;
