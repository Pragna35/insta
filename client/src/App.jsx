import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import SignUp from "./components/signup";

function App() {
  return (
    // <div className="flex min-h-svh flex-col items-center justify-center">
    //   <Button onClick={() => console.log("button clicked")}>Click me</Button>
    // </div>
    <>
    <SignUp/>
    </>
  );
}

export default App;
