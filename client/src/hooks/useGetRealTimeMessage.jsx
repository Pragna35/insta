import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRealTimeMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.chat);
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [messages, setMessages]);
};
export default useGetRealTimeMessages;
