import { Badge } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import store from "@/redux/Store";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {

    const {user} = useSelector(store => store.auth)
  return (
    <div className="w-fit my-10 pr-32">
       <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage
              src={user?.profilePicture}
              alt="post"
              className=""
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
          <div className="">
            <h1 className="capitalize font-semibold text-sm"><Link to ={`/profile/${user?._id}`}> {user?.username}</Link></h1>
          <span className="text-gray-600 text-sm">{user?.bio || "bio goes here..."}</span>
          </div>
        </div>
        <SuggestedUsers/>
    </div>
  );
};
export default RightSidebar;
