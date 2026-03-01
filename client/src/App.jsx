import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import SignUp from "./pages/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./components/Profile";
import MainLayout from "./pages/MainLayout";
import Home from "./components/Home";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";

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
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
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
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      //backend used port
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      //listening all the events
      socketio.on("getOnlineUsers", (onlineUsers) =>
        dispatch(setOnlineUsers(onlineUsers)),
      );
      // socketio.on("notification", (notification) =>
      //   dispatch(),
      // );

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
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
