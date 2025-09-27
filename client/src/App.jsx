import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import SignUp from "./pages/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./components/ui/Profile";
import MainLayout from "./pages/MainLayout";
import Home from "./components/ui/Home";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
         {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return (
    // <div className="flex min-h-svh flex-col items-center justify-center">
    //   <Button onClick={() => console.log("button clicked")}>Click me</Button>
    // </div>
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
