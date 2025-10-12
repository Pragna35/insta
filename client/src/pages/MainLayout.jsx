import Sidebar from "@/components/Sidebar";

import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    // <div>
    //     MAin layout page
    // </div>
    <>
      <Sidebar />
      <div className="">
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default MainLayout;
