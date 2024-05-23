import React, { useContext, useEffect, useState } from "react";
import "./MyPageEdit.css";
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
import { SNS_SIGN_IN_URL, signInRequest, updateUserProfile } from "../../api";
import { AuthContext } from "../../context/AuthContext";
import DeleteUserRequestDto from "../../api/request/user/delete-user.request.dto";
import UpdateUserRequestDto from "../../api/request/user/update-user.request.dto";

const MyPageEdit = () => {
  const { user, setUser, deleteUser, loading } = useContext(AuthContext);

  const [email, setEmail] = useState(user.email);
  const [id, setId] = useState(user.user_id);
  const [nickName, setNickName] = useState(user.userName);
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(user.gender);

  const [isError, setError] = useState<boolean>(false);

  const [message, setMessage] = useState<string>("");

  const [cookie, setCookie] = useCookies();

  const [editClick, setEditClick] = useState<boolean>(false);

  useEffect(() => {
    if (user.email && user.userName && user.user_id) {
      setEmail(user.email);
      setId(user.user_id);
      setNickName(user.userName);
      setGender(user.gender);
    }
  }, [user]);

  const navigate = useNavigate();

  if (loading) {
    return <div className="center-message"></div>;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "id") {
      setId(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "nickname") {
      setNickName(value);
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
      localStorage.setItem("user_id", userId);

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

  const onEditButton = () => {
    setEditClick(true);
  };

  const onDeleteUserButton = async () => {
    const requestBody: DeleteUserRequestDto = { userId: user.user_id };
    const result = await deleteUser(requestBody); // 로그아웃 함수 호출
    if (result) {
      navigate("/"); // 성공적으로 회원탈퇴 했으면 홈 페이지로 이동
    } else {
      alert("회원탈퇴에 실패하였습니다.");
    }
  };

  const onSaveButton = async () => {
    try {
      const requestBody: UpdateUserRequestDto = { email, password, nickName, gender };
      await updateUserProfile(requestBody);
    } catch (error) {
      console.log("User Profile Update Fail");
    }
  };

  const onCancleButton = () => {
    setEmail(user.email);
    setId(user.user_id);
    setNickName(user.userName);
    setEditClick(false);
  };

  const bottomButton = () => {
    if (!editClick) {
      return (
        <div className="btn btn-primary" style={{ width: "80px" }} onClick={() => onEditButton()}>
          수정
        </div>
      );
    } else if (editClick) {
      return (
        <>
          <div
            className="btn btn-primary"
            style={{ width: "80px", marginRight: "10px" }}
            onClick={() => onSaveButton()}
          >
            저장
          </div>
          <div className="btn btn-primary" style={{ width: "80px" }} onClick={() => onCancleButton()}>
            Cancle
          </div>
        </>
      );
    }
  };

  const onSnsSignInButtonClickHandler = (type: "kakao" | "naver") => {
    window.location.href = SNS_SIGN_IN_URL(type);
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
    <div className="d-flex flex-column align-items-center" style={{ minWidth: "800px" }}>
      <h3 className="align-self-start" style={{ marginLeft: "20%" }}>
        Mypage Edit
      </h3>
      <div className="mypage-edit-wrapper">
        <div className="align-self-start fs-4" style={{ padding: "10px" }}>
          회원정보
        </div>
        <form
          className="mypage-edit-form d-flex flex-column align-items-center "
          onSubmit={onSignInButtonClickHandler}
          style={{ position: "relative" }}
        >
          <div className="mypage-edit-inputbox d-flex flex-row">
            <label className="mypage-edit-input-label">Email</label>
            <input
              className={editClick ? "mypage-edit-input" : "mypage-edit-input-read"}
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
              required
              readOnly={editClick ? false : true}
            />
            {message && <div className={`${!isError ? "success-message" : "error-message"}`}>{message}</div>}
          </div>
          <div className="mypage-edit-inputbox d-flex flex-row">
            <label className="mypage-edit-input-label">ID</label>
            <input
              className={editClick ? "mypage-edit-input" : "mypage-edit-input-read"}
              type="text"
              name="id"
              value={id}
              onChange={handleChange}
              required
              readOnly={editClick ? false : true}
            />
            {message && <div className={`${!isError ? "success-message" : "error-message"}`}>{message}</div>}
          </div>

          <div className="mypage-edit-inputbox d-flex flex-row">
            <label className="mypage-edit-input-label">NickName</label>
            <input
              className={editClick ? "mypage-edit-input" : "mypage-edit-input-read"}
              type="text"
              name="nickname"
              value={nickName}
              onChange={handleChange}
              required
              readOnly={editClick ? false : true}
            />
            {message && <div className={`${!isError ? "success-message" : "error-message"}`}>{message}</div>}
          </div>
          <div className="mypage-edit-inputbox d-flex flex-row">
            <label className="mypage-edit-input-label">PW</label>
            <input
              className={editClick ? "mypage-edit-input" : "mypage-edit-input-read"}
              type="text"
              name="password"
              value={password}
              onChange={handleChange}
              required
              placeholder="현재 비밀번호를 입력하세요"
              readOnly={editClick ? false : true}
            />
            {message && <div className={`${!isError ? "success-message" : "error-message"}`}>{message}</div>}
          </div>
          <div className="mypage-edit-inputbox d-flex flex-row">
            <label className="mypage-edit-input-label">Alter-PW</label>
            <input
              className={editClick ? "mypage-edit-input" : "mypage-edit-input-read"}
              type="text"
              name="password"
              onChange={handleChange}
              required
              placeholder="변경할 비밀번호를 입력하세요"
              readOnly={editClick ? false : true}
            />
            {message && <div className={`${!isError ? "success-message" : "error-message"}`}>{message}</div>}
          </div>
          <div className="mypage-edit-inputbox d-flex flex-row">
            <label className="mypage-edit-input-label">Gender</label>
            <input
              className={editClick ? "mypage-edit-input" : "mypage-edit-input-read"}
              type="text"
              name="gender"
              onChange={handleChange}
              value={gender}
              required
              readOnly={editClick ? false : true}
            />
            {message && <div className={`${!isError ? "success-message" : "error-message"}`}>{message}</div>}
          </div>

          <div className="bottom-button-container">{bottomButton()}</div>
        </form>
      </div>
      <div className="mypage-edit-wrapper">
        <div className="align-self-start fs-4" style={{ padding: "10px" }}>
          소셜 로그인 관리 / 회원 탈퇴
        </div>
        {user.platform_type === "kakao" || user.platform_type === "naver" || user.platform_type === "google" ? (
          <form
            className="mypage-edit-form d-flex flex-column align-items-center "
            onSubmit={onSignInButtonClickHandler}
            style={{ position: "relative" }}
          >
            <div className="mypage-edit-inputbox d-flex flex-row">
              <label className="mypage-edit-input-label">서비스명</label>
              <div className="d-flex align-items-center">{user.platform_type}</div>
            </div>
            <div className="mypage-edit-inputbox d-flex flex-row">
              <label className="mypage-edit-input-label">가입일자</label>
              <div className="d-flex align-items-center">2024-05-03</div>
            </div>

            <div className="bottom-button-container">
              {" "}
              <div
                className="btn btn-primary"
                style={{ width: "120px", marginRight: "10px" }}
                onClick={() => onEditButton()}
              >
                연동 해제
              </div>
              <div className="btn btn-primary" style={{ width: "120px" }} onClick={() => onEditButton()}>
                회원 탈퇴
              </div>
            </div>
          </form>
        ) : (
          <form
            className="mypage-edit-form d-flex flex-column align-items-center "
            onSubmit={onSignInButtonClickHandler}
            style={{ position: "relative" }}
          >
            <div className="mypage-edit-inputbox d-flex flex-row">
              <label className="mypage-edit-input-label-sns">
                <LoginButtonCircle serviceName="Google" logo={googleLoginCircle} onClick={handleGoogleLogin} />
              </label>
              <div className="d-flex align-items-center">구글 로그인 연동</div>
            </div>

            <div className="mypage-edit-inputbox d-flex flex-row">
              <label className="mypage-edit-input-label-sns">
                {" "}
                <LoginButtonCircle
                  serviceName="Kakao"
                  logo={kakaoLoginCircle}
                  onClick={() => onSnsSignInButtonClickHandler("kakao")}
                />
              </label>
              <div className="d-flex align-items-center">카카오 로그인 연동</div>
            </div>
            <div className="mypage-edit-inputbox d-flex flex-row">
              <label className="mypage-edit-input-label-sns">
                <LoginButtonCircle
                  serviceName="Naver"
                  logo={naverLoginCircle}
                  onClick={() => onSnsSignInButtonClickHandler("naver")}
                />
              </label>
              <div className="d-flex align-items-center">네이버 로그인 연동</div>
            </div>

            <div className="bottom-button-container">
              {" "}
              <div className="btn btn-primary" style={{ width: "120px" }} onClick={() => onDeleteUserButton()}>
                회원 탈퇴
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyPageEdit;
