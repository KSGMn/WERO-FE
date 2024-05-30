import React, { useContext, useEffect, useState } from "react";
import "./MyPageEdit.css";
import naverLoginCircle from "../../assets/buttons/naver_login_circle.png";
import googleLoginCircle from "../../assets/buttons/google_login_circle.png";
import kakaoLoginCircle from "../../assets/buttons/kakao_login_circle.png";
import { LoginButtonCircle } from "../LoginButton/LoginButtons";
import { useNavigate } from "react-router-dom";
import { SNS_SIGN_IN_URL, updateUserProfile } from "../../api";
import { AuthContext } from "../../context/AuthContext";
import DeleteUserRequestDto from "../../api/request/user/delete-user.request.dto";
import UpdateUserRequestDto from "../../api/request/user/update-user.request.dto";
import Modal from "react-modal";

const MyPageEdit = () => {
  const { user, deleteUser, loading } = useContext(AuthContext);

  const [email, setEmail] = useState(user.email);
  const [id, setId] = useState(user.user_id);
  const [nickName, setNickName] = useState(user.userName);
  const [password, setPassword] = useState("");
  const [alterPassword, setAlterPassword] = useState("");
  const [gender, setGender] = useState(user.gender);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [idError, setIdError] = useState<boolean>(false);
  const [nickNameError, setNickNameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [idMessage, setIdMessage] = useState<string>("");
  const [nickNameMessage, setNickNameMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");

  const [editClick, setEditClick] = useState<boolean>(false);
  const [isDeleteUserConfirmModalOpen, setIsDeleteUserConfirmModalOpen] = useState(false);
  const { authNavigate } = useContext(AuthContext);
  useEffect(() => {
    if (user.email && user.userName && user.user_id) {
      setEmail(user.email);
      setId(user.user_id);
      setNickName(user.userName);
      setGender(user.gender);
    }
  }, [user]);

  if (loading) {
    return <div className="center-message"></div>;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "id") {
      setId(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "alter-password") {
      setAlterPassword(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "nickname") {
      setNickName(value);
    }
  };

  const onEditButton = () => {
    setEditClick(true);
  };

  const onDeleteUserComfirmButton = () => {
    setIsDeleteUserConfirmModalOpen(true);
  };

  const onDeleteUserButton = async () => {
    const requestBody: DeleteUserRequestDto = { userId: user.user_id };
    const result = await deleteUser(requestBody); // 로그아웃 함수 호출
    if (result) {
      authNavigate("/");
    } else {
      alert("회원탈퇴에 실패하였습니다.");
    }
  };

  const onSaveButton = async () => {
    setNickNameError(false);
    setNickNameMessage("");
    setPasswordError(false);
    setPasswordMessage("");
    const requestBody: UpdateUserRequestDto = { email, password, nickName, gender };
    await updateUserProfile(requestBody).then((data) => {
      if (data.code === "DN") {
        setNickNameError(true);
        setNickNameMessage("이미 사용중인 닉네임 입니다.");
      }
      if (data.code === "VF") {
        setPasswordError(true);
        setPasswordMessage("기존 비밀번호가 아닙니다.");
      }
    });
  };

  const onCancleButton = () => {
    setEmail(user.email);
    setId(user.user_id);
    setNickName(user.userName);
    setEditClick(false);
    setNickNameError(false);
    setNickNameMessage("");
    setPasswordError(false);
    setPasswordMessage("");
    setPassword("");
    setAlterPassword("");
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
            취소
          </div>
        </>
      );
    }
  };

  const closeConfirmModal = () => {
    setIsDeleteUserConfirmModalOpen(false);
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
        <form className="mypage-edit-form d-flex flex-column align-items-center " style={{ position: "relative" }}>
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
          </div>
          {emailMessage && (
            <div className={`${!emailError ? "mypage-edit-success-message" : "mypage-edit-error-message"}`}>
              {emailMessage}
            </div>
          )}
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
          </div>
          {idMessage && (
            <div className={`${!idError ? "mypage-edit-success-message" : "mypage-edit-error-message"}`}>
              {idMessage}
            </div>
          )}

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
          </div>
          {nickNameMessage && (
            <div className={`${!nickNameError ? "mypage-edit-success-message" : "mypage-edit-error-message"}`}>
              {nickNameMessage}
            </div>
          )}
          <div className="mypage-edit-inputbox d-flex flex-row">
            <label className="mypage-edit-input-label">PW</label>
            <input
              className={editClick ? "mypage-edit-input" : "mypage-edit-input-read"}
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              placeholder="현재 비밀번호를 입력하세요"
              readOnly={editClick ? false : true}
            />
          </div>
          {passwordMessage && (
            <div className={`${!passwordError ? "mypage-edit-success-message" : "mypage-edit-error-message"}`}>
              {passwordMessage}
            </div>
          )}
          <div className="mypage-edit-inputbox d-flex flex-row">
            <label className="mypage-edit-input-label">Alter-PW</label>
            <input
              className={editClick ? "mypage-edit-input" : "mypage-edit-input-read"}
              type="password"
              name="alter-password"
              value={alterPassword}
              onChange={handleChange}
              required
              placeholder="변경할 비밀번호를 입력하세요"
              readOnly={editClick ? false : true}
            />
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
          </div>

          <div className="bottom-button-container">{bottomButton()}</div>
        </form>
      </div>
      <div className="mypage-edit-wrapper">
        <div className="align-self-start fs-4" style={{ padding: "10px" }}>
          소셜 로그인 관리 / 회원 탈퇴
        </div>
        {user.platform_type === "kakao" || user.platform_type === "naver" || user.platform_type === "google" ? (
          <form className="mypage-edit-form d-flex flex-column align-items-center " style={{ position: "relative" }}>
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
              <div className="btn btn-primary" style={{ width: "120px" }} onClick={() => onDeleteUserComfirmButton()}>
                회원 탈퇴
              </div>
            </div>
          </form>
        ) : (
          <form className="mypage-edit-form d-flex flex-column align-items-center " style={{ position: "relative" }}>
            {/* <div className="mypage-edit-inputbox d-flex flex-row">
              <label className="mypage-edit-input-label-sns">
                <LoginButtonCircle serviceName="Google" logo={googleLoginCircle} onClick={handleGoogleLogin} />
              </label>
              <div className="d-flex align-items-center">구글 로그인 연동</div>
            </div> */}

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
              <div className="btn btn-primary" style={{ width: "120px" }} onClick={() => onDeleteUserComfirmButton()}>
                회원 탈퇴
              </div>
            </div>
          </form>
        )}
      </div>
      <Modal
        isOpen={isDeleteUserConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Confirm Deletion"
        overlayClassName="confirm-modal-overlay"
        className="confirm-modal-content"
      >
        <h5>정말 탈퇴하시겠습니까?</h5>
        <div className="confirm-modal-buttons">
          <button className="btn cancel" onClick={() => onDeleteUserButton()}>
            예
          </button>
          <button className="btn" onClick={() => setIsDeleteUserConfirmModalOpen(false)}>
            아니오
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyPageEdit;
