import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
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
          src="https://github.com/shadcn.png"
          className="h-[30px] w-[30px] rounded-full"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    label: "Profile",
  },
  {
    icon: <LogOut />,
    label: "Logout",
  },
];

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 z-10 w-[16%] h-screen border-r border-gray-300 px-4">
      <div className="flex flex-col">
        <h1>LOGO</h1>
        {sidebarItems.map((item, ind) => {
          return (
            <div key={ind} className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-2">
              <span>{item.icon}</span>
              <p>{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;
