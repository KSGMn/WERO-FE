import React, { useEffect, useState } from "react";

import "./Signup.css";
import { LoginButtonCircle } from "../LoginButton/LoginButtons";
import naverLoginCircle from "../../assets/buttons/naver_login_circle.png";
import googleLoginCircle from "../../assets/buttons/google_login_circle.png";
import kakaoLoginCircle from "../../assets/buttons/kakao_login_circle.png";

const Signup = () => {
  // const [email, setEmail] = useState("");
  // const [id, setId] = useState("");
  // const [name, setName] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [gender, setGender] = useState("");
  // const [termsAccepted, setTermsAccepted] = useState(false);

  const [formValues, setFormValues] = useState({
    email: "",
    cfNumber: "",
    id: "",
    name: "",
    password: "",
    confirmPassword: "",
    gender: "",
    termsAccepted: false,
  });

  const [formErrors, setFormErrors] = useState({
    email: false,
    cfNumber: false,
    id: false,
    name: false,
    password: false,
    confirmPassword: false,
  });

  const [formMessage, setFormMessage] = useState({
    email: "",
    cfNumber: "",
    id: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [verified, setVerified] = useState({
    email: false,
    id: false,
  });

  // const [isEmailError, setEmailError] = useState(false);
  // const [isIdError, setIdError] = useState(false);
  // const [isNameError, setNameError] = useState(false);
  // const [isPasswordError, setPasswordError] = useState(false);
  // const [isConfirmPasswordError, setConfirmPasswordError] = useState(false);

  // const [isEmailMessage, setEmailMessage] = useState("");
  // const [isIdMessage, setIdMessage] = useState("");
  // const [isNameMessage, setNameMessage] = useState("");
  // const [isPasswordMessage, setPasswordMessage] = useState("");
  // const [isConfirmPasswordMessage, setConfirmPasswordMessage] = useState("");

  const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;

  const handleEmailCheck = () => {
    // Logic to check if email is unique
    // Typically involves making an API call to the server
    console.log("Checking email:", formValues.email);
    // Mock response handling
    alert("Email is available!");
  };

  //이메일 인증 버튼
  const onEmailButtonClickHandler = () => {
    const checkedEmail = emailPattern.test(formValues.email);

    if (!checkedEmail) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: true,
      }));
      setFormMessage((prevMessages) => ({
        ...prevMessages,
        email: "올바른 이메일 형식이 아닙니다",
      }));
      return;
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      email: false,
    }));
    setFormMessage((prevMessages) => ({
      ...prevMessages,
      email: "이메일 전송중...",
    }));
  };

  //인증번호 확인 버튼
  const onCfNumberButtonClickHandler = () => {
    //인증번호 불일치
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      cfNumber: true,
    }));
    setFormMessage((prevMessages) => ({
      ...prevMessages,
      cfNumber: "인증번호가 틀립니다",
    }));
  };

  //아이디 중복확인 버튼
  const onIdButtonClickHandler = () => {};

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    if (type === "checkbox") {
      setFormValues((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  //비밀번호 유효성 검사
  useEffect(() => {
    const passwordValid = formValues.password && passwordPattern.test(formValues.password);
    const passwordsMatch =
      formValues.password && formValues.confirmPassword && formValues.password === formValues.confirmPassword;

    setFormErrors({
      password: !passwordValid,
      confirmPassword: formValues.confirmPassword ? !passwordsMatch : false,
    });

    setFormMessage({
      password: formValues.password
        ? passwordValid
          ? ""
          : "비밀번호는 영문자와 숫자를 포함한 8-13자여야 합니다."
        : "",
      confirmPassword: formValues.confirmPassword ? (passwordsMatch ? "" : "비밀번호가 일치하지 않습니다.") : "",
    });
  }, [formValues.password, formValues.confirmPassword]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add submission logic here
    console.log("Form Submitted:", formValues);
  };

  // 회원가입 버튼 비활성화 조건
  const isDisabled = () => {
    // 필수 필드가 비어 있는지 확인
    const isEmpty =
      !formValues.email ||
      !formValues.name ||
      !formValues.password ||
      !formValues.confirmPassword ||
      !formValues.termsAccepted;

    // 어떤 에러 메시지도 있으면 안 됨
    const hasErrors = Object.values(formErrors).some((error) => error);

    // 이메일과 아이디가 검증되었는지 확인
    //const notVerified = !formValues.emailVerified || !formValues.idVerified;

    return isEmpty || hasErrors; //|| notVerified;
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
    <div className="signup-wrapper">
      <form className="signup-form" onSubmit={handleSubmit} style={{ position: "relative", maxWidth: "380px" }}>
        <h3>회원가입</h3>
        <div className="signup-inputbox d-flex flex-column">
          <input
            className="signup-input"
            type="email"
            placeholder="이메일을 입력해 주세요."
            name="email"
            value={formValues.email}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={onEmailButtonClickHandler}
            className={formValues.email ? "check-button" : "disable-check-button"}
          >
            인증하기
          </button>
          {formMessage.email && (
            <div className={`${!formErrors.email ? "success-message" : "error-message"}`}>{formMessage.email}</div>
          )}
        </div>
        <div className="signup-inputbox d-flex flex-column">
          <input
            className="signup-input"
            type="cfNumber"
            placeholder="인증번호를 입력해 주세요."
            name="cfNumber"
            value={formValues.cfNumber}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={onCfNumberButtonClickHandler}
            className={formValues.cfNumber ? "check-button" : "disable-check-button"}
          >
            인증확인
          </button>
          {formMessage.cfNumber && (
            <div className={`${!formErrors.cfNumber ? "success-message" : "error-message"}`}>
              {formMessage.cfNumber}
            </div>
          )}
        </div>

        <div className="signup-inputbox d-flex">
          <input
            className="signup-input"
            type="id"
            placeholder="사용하실 아이디를 입력해 주세요."
            name="id"
            value={formValues.id}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => console.log("Checking id")}
            className={formValues.id ? "check-button" : "disable-check-button"}
          >
            중복확인
          </button>
        </div>

        <div className="signup-inputbox">
          <input
            className="signup-input"
            type="text"
            placeholder="이름을 입력해 주세요."
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-inputbox">
          <input
            className="signup-input"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            name="password"
            value={formValues.password}
            onChange={handleChange}
            required
          />
          {formMessage.password && (
            <div className={`${!formErrors.password ? "success-message" : "error-message"}`}>
              {formMessage.password}
            </div>
          )}
        </div>
        <div className="signup-inputbox">
          <input
            className="signup-input"
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요."
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            required
          />
          {formMessage.confirmPassword && (
            <div className={`${!formErrors.confirmPassword ? "success-message" : "error-message"}`}>
              {formMessage.confirmPassword}
            </div>
          )}
        </div>
        <div className="gender">
          <label>
            <input
              className="signup-input"
              type="radio"
              name="gender"
              value="woman"
              checked={formValues.gender === "woman"}
              onChange={handleChange}
            />{" "}
            여성
          </label>
          <label>
            <input
              className="signup-input"
              type="radio"
              name="gender"
              value="man"
              checked={formValues.gender === "man"}
              onChange={handleChange}
            />{" "}
            남성
          </label>
          <label>
            <input
              className="signup-input"
              type="radio"
              name="gender"
              value="other"
              checked={formValues.gender === "other"}
              onChange={handleChange}
            />{" "}
            기타
          </label>
        </div>
        <div className="inputbox" style={{ marginBottom: "20px" }}>
          <input
            className="signup-input"
            type="checkbox"
            name="termsAccepted"
            checked={formValues.termsAccepted}
            onChange={handleChange}
          />{" "}
          이용약관 개인정보 수집 및 이용, 마케팅 활용에 모두 동의합니다
        </div>

        <button className="signup-submit-btn btn btn-primary w-100 mt-4" type="submit" disabled={isDisabled()}>
          가입하기
        </button>
      </form>
      <label style={{ marginBottom: "20px", marginTop: "20px" }}>SNS 회원가입</label>
      <div className="social-login-btn d-flex flex-row justify-content-around w-50">
        <LoginButtonCircle serviceName="Google" logo={googleLoginCircle} onClick={handleGoogleLogin} />
        <LoginButtonCircle serviceName="Kakao" logo={kakaoLoginCircle} onClick={handleKakaoLogin} />
        <LoginButtonCircle serviceName="Naver" logo={naverLoginCircle} onClick={handleNaverLogin} />
      </div>
    </div>
  );
};

export default Signup;
