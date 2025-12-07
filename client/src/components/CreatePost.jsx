import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const imgRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
// runs every time the open state changes and clear the data when we close the modal
  useEffect(() => {
  if (!open) {
    setCaption("");
    setFile("");
    setPreview("");
    setLoading(false);
  }
}, [open]);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setPreview(dataUrl);
    }
  };
  const createPostHandler = async (e) => {
    e.preventDefault();
    // console.log(file, caption);
    const formData = new FormData();
    formData.append("caption", caption);
    // do revision
    if (file) {
      // the "image" string name inside append should be same as backend upload.single("image")
      formData.append("image", file);
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts,]));
        toast.success(res.data.message);
        setOpen(false)
        setFile("")
        setCaption("")
        setPreview("")
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Avatar className="border">
            <AvatarImage src={user?.profilePicture} alt="img"></AvatarImage>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user.username}</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
          </div>
        </div>
        <Textarea
          className="focus-visible:ring-transparent border-none"
          placeholder="write caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {preview && (
          <div className="w-full h-64 items-center justify-center">
            <img
              src={preview}
              alt="preview-img"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        )}
        <input
          ref={imgRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imgRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Browse here
        </Button>
        {preview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full"
              onClick={createPostHandler}
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};
export default CreatePost;
