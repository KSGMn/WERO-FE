import React from "react";
import Login from "../components/Login/Login";

const LoginComponent = () => {
  const handleLogin = (event) => {
    event.preventDefault();
    // 로그인 로직 구현
    console.log("로그인 시도");
  };
  return (
    <div className="login-form d-flex justify-content-center">
      <Login />
    </div>
  );
};

export default LoginComponent;
