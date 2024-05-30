import React, { useEffect, useState } from "react";

import "./Signup.css";
import { LoginButtonCircle } from "../LoginButton/LoginButtons";
import naverLoginCircle from "../../assets/buttons/naver_login_circle.png";
import googleLoginCircle from "../../assets/buttons/google_login_circle.png";
import kakaoLoginCircle from "../../assets/buttons/kakao_login_circle.png";
import {
  CheckCertificationResponseDto,
  EmailCertificationResponsetDto,
  IdCheckResponseDto,
  SignupResponseDto,
} from "../../api/response/auth";
import { ResponseBody } from "../../types";
import { ResponseCode } from "../../types/enums";
import {
  CheckCertificationRequestDto,
  EmailCertificationRequestDto,
  IdCheckRequestDto,
  SignUpRequestDto,
} from "../../api/request/auth";
import {
  SNS_SIGN_IN_URL,
  checkCertificationRequest,
  emailCertificationRequest,
  idCheckRequest,
  signUpRequest,
} from "../../api";
import { useNavigate } from "react-router-dom";

interface FormErrors {
  id?: boolean;
  email?: boolean;
  cfNumber?: boolean;
  name?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
}

interface FormMessages {
  id?: string;
  email?: string;
  cfNumber?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
}

const Signup = () => {
  const [formValues, setFormValues] = useState({
    id: "",
    email: "",
    cfNumber: "",
    name: "",
    password: "",
    confirmPassword: "",
    gender: "",
    termsAccepted: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    id: false,
    email: false,
    cfNumber: false,
    name: false,
    password: false,
    confirmPassword: false,
  });

  const [formMessage, setFormMessage] = useState<FormMessages>({
    id: "",
    email: "",
    cfNumber: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [verified, setVerified] = useState({
    id: false,
    cfNumber: false,
  });

  const navigate = useNavigate();

  const [isIdCheck, setIdCheck] = useState<boolean>(false);
  const [isCertificationCheck, setCertificationCheck] = useState<boolean>(false);

  const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/;

  const idCheckResponse = (responseBody: ResponseBody<IdCheckResponseDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;

    if (code === ResponseCode.VALIDATION_FAIL) alert("아이디를 입력하세요.");
    if (code === ResponseCode.DUPLICATE_ID) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        id: true,
      }));

      setFormMessage((prevMessage) => ({
        ...prevMessage,
        id: "이미 사용중인 아이디 입니다.",
      }));

      setIdCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    if (code.toString() === ResponseCode.SUCCESS) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        id: false,
      }));

      setFormMessage((prevMessage) => ({
        ...prevMessage,
        id: "사용 가능한 아이디 입니다.",
      }));
      setVerified((prevVerified) => ({ ...prevVerified, id: true }));
      setIdCheck(true);
    }
  };

  const emailCertificationResponse = (responseBody: ResponseBody<EmailCertificationResponsetDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert("이메일을 입력하세요.");

    if (code === ResponseCode.MAIL_FAIL) alert("이메일 전송에 실패했습니다.");
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    if (code === ResponseCode.SUCCESS) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: false,
      }));
      setFormMessage((prevMessage) => ({
        ...prevMessage,
        email: "이메일 전송중...",
      }));
    }
  };

  const checkCertificationResponse = (responseBody: ResponseBody<CheckCertificationResponseDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;

    if (code === ResponseCode.VALIDATION_FAIL) alert("아이디, 이메일, 인증번호를 모두 입력하세요.");
    if (code === ResponseCode.CERTIFICATION_FAIL) {
      setFormErrors((prevErrors) => ({ ...prevErrors, cfNumber: true }));
      setFormMessage((prevMessage) => ({ ...prevMessage, cfNumber: "인증번호가 일치하지 않습니다" }));
      setCertificationCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    if (code === ResponseCode.SUCCESS) {
      setFormErrors((prevErrors) => ({ ...prevErrors, cfNumber: false }));
      setFormMessage((prevMessage) => ({
        ...prevMessage,
        cfNumber: "인증번호가 확인되었습니다",
        email: "인증이 완료되었습니다",
      }));
      setVerified((prevVerified) => ({ ...prevVerified, cfNumber: true }));
      setCertificationCheck(true);
    }
  };

  const signUpResponse = (responseBody: ResponseBody<SignupResponseDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    if (code === ResponseCode.SUCCESS) {
      navigate("/login");
    }
  };

  //아이디 중복확인 버튼
  const onIdButtonClickHandler = () => {
    if (!formValues.id) return;
    const requestBody: IdCheckRequestDto = { id: formValues.id };

    idCheckRequest(requestBody).then(idCheckResponse);
  };

  const handleChange = (event: any) => {
    const { name, value, checked, type } = event.target;
    if (type === "checkbox") {
      setFormValues((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  //이메일 인증 버튼
  const onEmailButtonClickHandler = () => {
    if (!formValues.id || !formValues.email) return;

    const checkedEmail = emailPattern.test(formValues.email);

    if (!checkedEmail) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: false,
      }));
      setFormMessage((prevMessage) => ({
        ...prevMessage,
        email: "올바른 이메일 형식이 아닙니다 ",
      }));
      return;
    }
    const requestBody: EmailCertificationRequestDto = { id: formValues.id, email: formValues.email };
    emailCertificationRequest(requestBody).then(emailCertificationResponse);

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      email: false,
    }));
    setFormMessage((prevMessage) => ({
      ...prevMessage,
      email: "이메일 전송중...",
    }));
  };

  //인증번호 확인 버튼
  const onCfNumberButtonClickHandler = () => {
    if (!formValues.id || !formValues.email || !formValues.cfNumber) return;

    const requestBody: CheckCertificationRequestDto = {
      id: formValues.id,
      email: formValues.email,
      certificationNumber: formValues.cfNumber,
    };
    checkCertificationRequest(requestBody).then(checkCertificationResponse);
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
          : "비밀번호는 소문문자와 대문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다."
        : "",
      confirmPassword: formValues.confirmPassword ? (passwordsMatch ? "" : "비밀번호가 일치하지 않습니다.") : "",
    });
  }, [formValues.password, formValues.confirmPassword]);

  //회원가입 버튼
  const onSignUpButtonClickHandler = (event: any) => {
    event.preventDefault();
    const requestBody: SignUpRequestDto = {
      id: formValues.id,
      password: formValues.password,
      nickName: formValues.name,
      gender: formValues.gender,
      email: formValues.email,
      certificationNumber: formValues.cfNumber,
    };
    signUpRequest(requestBody).then(signUpResponse);
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
    const notVerified = !verified.id || !verified.cfNumber;

    return isEmpty || hasErrors || notVerified;
  };

  const handleGoogleLogin = () => {
    console.log("Google 로그인 진행");
    // 실제로는 Google 로그인 API 호출
  };

  const onSnsSignInButtonClickHandler = (type: "kakao" | "naver") => {
    window.location.href = SNS_SIGN_IN_URL(type);
  };

  return (
    <div className="signup-wrapper">
      <form
        method="POST"
        action="/signup"
        className="signup-form"
        onSubmit={onSignUpButtonClickHandler}
        style={{ position: "relative", maxWidth: "380px" }}
      >
        <h3>회원가입</h3>
        <div className="signup-inputbox d-flex flex-column">
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
            onClick={onIdButtonClickHandler}
            className={formValues.id ? "check-button" : "disable-check-button"}
          >
            중복확인
          </button>
          {formMessage.id && (
            <div className={`${!formErrors.id ? "success-message" : "error-message"}`}>{formMessage.id}</div>
          )}
        </div>

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
        {/* <LoginButtonCircle serviceName="Google" logo={googleLoginCircle} onClick={handleGoogleLogin} /> */}
        <LoginButtonCircle serviceName="Kakao" logo={kakaoLoginCircle} onClick={onSnsSignInButtonClickHandler} />
        <LoginButtonCircle serviceName="Naver" logo={naverLoginCircle} onClick={onSnsSignInButtonClickHandler} />
      </div>
    </div>
  );
};

export default Signup;
