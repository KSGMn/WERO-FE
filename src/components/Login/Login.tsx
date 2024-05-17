import React, { useContext, useState } from "react";
import "./Login.css";
import naverLoginCircle from "../../assets/buttons/naver_login_circle.png";
import googleLoginCircle from "../../assets/buttons/google_login_circle.png";
import kakaoLoginCircle from "../../assets/buttons/kakao_login_circle.png";
import { LoginButtonCircle } from "../LoginButton/LoginButtons";
import { ResponseBody } from "../../types";
import { SignInResponseDto } from "../../api/response/auth";
import { ResponseCode } from "../../types/enums";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { SignInRequestDto } from "../../api/request/auth";
import { SNS_SIGN_IN_URL, signInRequest } from "../../api";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setError] = useState<boolean>(false);

  const [message, setMessage] = useState<string>("");

  const [cookie, setCookie] = useCookies();

  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "id") {
      setId(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const signInResponse = (responseBody: ResponseBody<SignInResponseDto>) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert("아이디와 비밀번호를 입력하세요.");
    if (code === ResponseCode.SIGN_IN_FAIL) {
      setError(true);
      setMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    if (code === ResponseCode.SUCCESS) {
      const { token, expirationTime, userId } = responseBody as SignInResponseDto;

      const now = new Date().getTime();
      const expires = new Date(now + Number(expirationTime) * 1000);

      setUser({ ...user, user_id: userId });
      localStorage.setItem("isLoggedIn", "true");
      //localStorage.setItem("user_id", userId);

      setError(false);
      setCookie("accessToken", token, { expires, path: "/" });
      navigate("/");
    }
  };

  const onSignInButtonClickHandler = (event: any) => {
    event.preventDefault();
    if (!id || !password) {
      alert("아이디와 비밀번호 모두 입력하세요.");
      return;
    }

    const requestBody: SignInRequestDto = { id, password };
    signInRequest(requestBody).then(signInResponse);
  };

  const onSnsSignInButtonClickHandler = (type: "kakao" | "naver") => {
    window.location.href = SNS_SIGN_IN_URL(type);
    localStorage.setItem("isLoggedIn", "true");
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
        onSubmit={onSignInButtonClickHandler}
        style={{ position: "relative", maxWidth: "380px" }}
      >
        <h3>Login</h3>
        <div className="login-inputbox d-flex">
          <input
            className="login-input"
            type="id"
            placeholder="이메일을 입력해 주세요."
            name="id"
            value={id}
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
          {message && <div className={`${!isError ? "success-message" : "error-message"}`}>{message}</div>}
        </div>

        <button
          className="login-submit-btn btn btn-primary  w-100"
          type="submit"
          disabled={!id || !password}
          style={{ marginTop: "20px" }}
        >
          Login!
        </button>
      </form>
      <label style={{ marginBottom: "20px", marginTop: "20px" }}>SNS 로그인</label>
      <div className="social-login-btn d-flex flex-row justify-content-around w-50">
        <LoginButtonCircle serviceName="Google" logo={googleLoginCircle} onClick={handleGoogleLogin} />
        <LoginButtonCircle
          serviceName="Kakao"
          logo={kakaoLoginCircle}
          onClick={() => onSnsSignInButtonClickHandler("kakao")}
        />
        <LoginButtonCircle
          serviceName="Naver"
          logo={naverLoginCircle}
          onClick={() => onSnsSignInButtonClickHandler("naver")}
        />
      </div>
    </div>
  );
};

export default Login;
