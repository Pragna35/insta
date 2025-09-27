import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const inputHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    // console.log(formData);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
    }
  };
  return (
    <>
      {/* <h1 className="text-center">Signup page</h1> */}

      <div className="flex w-full h-screen justify-center items-center">
        <form
          action=""
          onSubmit={signupHandler}
          className="shadow-lg flex flex-col gap-5 p-8"
        >
          <div className="my-4">
            <h1 className="font-bold text-center text-xl">Logo</h1>
            <p className="text-sm text-center">
              Signup to see the photos and videos from your friends.
            </p>
          </div>
          <div>
            <Label className="font-medium">Username</Label>
            <Input
              type="text"
              placeholder="Enter Username"
              name="username"
              value={formData.username}
              onChange={inputHandler}
              className="focus-visible:ring-transparent my-2"
            ></Input>
            <Label className="font-medium">Email</Label>
            <Input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={formData.email}
              onChange={inputHandler}
              className="focus-visible:ring-transparent my-2"
            ></Input>
            <Label className="font-medium">Password</Label>
            <Input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={formData.password}
              onChange={inputHandler}
              className="focus-visible:ring-transparent my-2"
            ></Input>
          
          </div>
            <Button type="submit" className="w-full mt-5 py-2">
              Signup
            </Button>
            <span className="text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>

        </form>
      </div>
    </>
  );
};

export default SignUp;
