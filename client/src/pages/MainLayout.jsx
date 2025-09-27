import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    // <div>
    //     MAin layout page
    // </div>
    <>
      Sidebar
      <div>
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default MainLayout;
