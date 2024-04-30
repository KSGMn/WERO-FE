import React from "react";

import naverLogin from "../../assets/buttons/naver_login.png";
import kakaoLogin from "../../assets/buttons/kakao_login.png";
import googleLogin from "../../assets/buttons/google_login.png";
import naverLoginCircle from "../../assets/buttons/naver_login_circle.png";
import googleLoginCircle from "../../assets/buttons/google_login_circle.png";
import kakaoLoginCircle from "../../assets/buttons/kakao_login_circle.png";

export const LoginButton = ({ serviceName, logo, onClick }) => {
  return (
    <button
      className="loginButton"
      style={{
        border: "none",
        display: "flex",
        background: "none",
        width: "200px",
        height: "50px",
        objectFit: "contain",
      }}
      onClick={onClick}
    >
      <img
        src={logo}
        alt={`${serviceName} loginBtn`}
        className="buttonLogo"
        style={{ pointerEvents: "none" }}
      />
    </button>
  );
};
export const LoginButtonCircle = ({ serviceName, logo, onClick }) => {
  return (
    <button
      className="loginButton"
      style={{
        border: "none",
        display: "flex",
        background: "none",
        borderRadius: "50%",
        objectFit: "contain",
      }}
      onClick={onClick}
    >
      <img
        src={logo}
        alt={`${serviceName} loginBtn`}
        className="buttonLogoCircle"
        style={{ pointerEvents: "none" }}
      />
    </button>
  );
};

const LoginButtons = () => {
  const handleGoogleLogin = () => {
    console.log("Google 로그인 진행");
    // 실제로는 Google 로그인 API 호출
  };

  const handleKakaoLogin = () => {
    console.log("Kakao 로그인 진행");
    // 실제로는 Kakao 로그인 API 호출
  };

  const handleNaverLogin = () => {
    console.log("로그인 시도");
    window.location.href = "http://localhost:8080/api/login/naver"; // 직접 서버의 리다이렉트 URL로 이동
  };

  return (
    <div className="d-flex flex-row mt-5">
      <LoginButton
        serviceName="Google"
        logo={googleLogin}
        onClick={handleGoogleLogin}
      />
      <LoginButton
        serviceName="Kakao"
        logo={kakaoLogin}
        onClick={handleKakaoLogin}
      />
      <LoginButton
        serviceName="Naver"
        logo={naverLogin}
        onClick={handleNaverLogin}
      />
      <LoginButtonCircle
        serviceName="Google"
        logo={googleLoginCircle}
        onClick={handleGoogleLogin}
      />
      <LoginButtonCircle
        serviceName="Kakao"
        logo={kakaoLoginCircle}
        onClick={handleKakaoLogin}
      />
      <LoginButtonCircle
        serviceName="Naver"
        logo={naverLoginCircle}
        onClick={handleNaverLogin}
      />
    </div>
  );
};

export default LoginButtons;
