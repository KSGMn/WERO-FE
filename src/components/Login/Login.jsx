import React, { useState } from "react";
import "./Login.css";
import naverLoginCircle from "../../assets/buttons/naver_login_circle.png";
import googleLoginCircle from "../../assets/buttons/google_login_circle.png";
import kakaoLoginCircle from "../../assets/buttons/kakao_login_circle.png";
import { LoginButtonCircle } from "../LoginButton/LoginButtons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    eval(`set${name.charAt(0).toUpperCase() + name.slice(1)}`)(value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add submission logic here
    console.log("Form Submitted:", {
      email,
      password,
    });
  };

  const handleGoogleLogin = () => {
    console.log("Google 로그인 진행");
    // 실제로는 Google 로그인 API 호출
  };

  const handleKakaoLogin = () => {
    console.log("Kakao 로그인 진행");
    // 실제로는 Kakao 로그인 API 호출
  };

  const handleNaverLogin = () => {
    console.log("Naver 로그인 진행");
  };

  return (
    <div className="login-wrapper">
      <form
        className="login-form d-flex flex-column align-items-center"
        onSubmit={handleSubmit}
        style={{ position: "relative", maxWidth: "380px" }}
      >
        <h3>Login</h3>
        <div className="login-inputbox d-flex">
          <input
            className="login-input"
            type="email"
            placeholder="이메일을 입력해 주세요."
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-inputbox">
          <input
            className="login-input"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="login-submit-btn btn btn-primary  w-100"
          type="submit"
          disabled={!email || !password}
          style={{ marginTop: "20px" }}
        >
          Login!
        </button>
      </form>
      <label style={{ marginBottom: "20px", marginTop: "20px" }}>SNS 로그인</label>
      <div className="social-login-btn d-flex flex-row justify-content-around w-50">
        <LoginButtonCircle serviceName="Google" logo={googleLoginCircle} onClick={handleGoogleLogin} />
        <LoginButtonCircle serviceName="Kakao" logo={kakaoLoginCircle} onClick={handleKakaoLogin} />
        <LoginButtonCircle serviceName="Naver" logo={naverLoginCircle} onClick={handleNaverLogin} />
      </div>
    </div>
  );
};

export default Login;
