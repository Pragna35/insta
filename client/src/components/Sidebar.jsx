import { setAuthUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  CircleUser,
  Film,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Search,
  SquarePlus,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const LogoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  const sidebarHandler = (labelType) => {
    if (labelType === "Logout") {
      LogoutHandler();
    } else if (labelType === "Create") {
      setOpen(true);
    } else if (labelType === "Profile") {
      navigate(`profile/${user?._id}`);
    } else if (labelType === "Home") {
      navigate("/");
    }else if (labelType === "Messages") {
      navigate("/chat");
    }
  };
  const sidebarItems = [
    {
      icon: <Home />,
      label: "Home",
    },
    {
      icon: <Search />,
      label: "Search",
    },
    {
      icon: <TrendingUp />,
      label: "Explore",
    },
    {
      icon: <Heart />,
      label: "Notifications",
    },
    {
      icon: <MessageCircle />,
      label: "Messages",
    },
    {
      icon: <Film />,
      label: "Reels",
    },
    {
      icon: <SquarePlus />,
      label: "Create",
    },
    {
      icon: (
        <Avatar>
          <AvatarImage
            src={user?.profilePicture}
            // src={user?.profilePicture}
            className="h-[30px] w-[30px] rounded-full"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      label: "Profile",
      // label: user?.username,
    },
    {
      icon: <LogOut />,
      label: "Logout",
    },
  ];
  return (
    <div className="fixed top-0 left-0 z-10 w-[16%] h-screen border-r border-gray-300 px-4">
      <div className="flex flex-col">
        <h1 className="text-center my-8 mx-auto text-xl font-bold">LOGO</h1>
        {sidebarItems.map((item, ind) => {
          return (
            <div
              key={ind}
              onClick={() => sidebarHandler(item.label)}
              className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-2"
            >
              <span>{item.icon}</span>
              <p>{item.label}</p>
            </div>
          );
        })}
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};
export default Sidebar;
