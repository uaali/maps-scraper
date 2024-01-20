import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";
import "../assets/tailwind.css";
import { UserInput, Login, Output, SignUp, Home } from "../components";

const App = () => {
  const [page, setPage] = useState("UserInput");

  const sendMessageToBackgroundScript = (msg) => {
    (async () => {
      const response = await chrome.runtime.sendMessage({ msg });
      // do something with response here, not outside the function
      console.log(response);
    })();
  };

  return (
    <div>
      <div>
        {page === "Home" && <Home setPage={setPage} />}
        {page === "SignUp" && <SignUp />}
        {page === "Login" && <Login />}
        {page === "UserInput" && (
          <UserInput sendMsg={sendMessageToBackgroundScript} />
        )}
        {page === "Output" && <Output />}
      </div>
    </div>
  );
};

const popup = (
  <div>
    <App />
  </div>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(popup);
