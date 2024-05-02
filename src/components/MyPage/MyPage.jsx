import React, { useContext } from "react";
import "./MyPage.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const MyPage = () => {
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout(); // 로그아웃 함수 호출
    if (result) {
      navigate("/"); // 성공적으로 로그아웃 했으면 홈 페이지로 이동
    } else {
      console.error("Failed to logout"); // 로그아웃 실패 처리
    }
  };

  return (
    <div className="container">
      <div className="profile d-flex flex-column align-items-center" style={{ height: "auto" }}>
        <div className="profile-image-container mb-3">
          <img
            src=""
            alt=""
            style={{
              width: "120px",
              height: "120px",
              background: "black",
              borderRadius: "50%",
            }}
          />
        </div>
        <div className="user-info text-center ">
          <h4 className="text-black">{user.userName}</h4>
          <p className="text-black m-0">{user.bio}</p>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <div className="el-btn btn">Edit</div>
        <div className="el-btn btn" onClick={() => handleLogout()}>
          Logout
        </div>
      </div>

      <div className="gallery-btn d-flex flex-row justify-content-center" style={{ height: "auto" }}>
        <Link
          to="/mypage/history"
          className={`btn ${
            location.pathname === "/mypage/history" || location.pathname === "/mypage"
              ? "custom-btn-click"
              : "custom-btn"
          }`}
        >
          History
        </Link>
        <Link
          to="/mypage/likes"
          className={`btn ${location.pathname === "/mypage/likes" ? "custom-btn-click" : "custom-btn"}`}
        >
          Likes
        </Link>
      </div>
      <div className="container" style={{ height: "auto" }}>
        <div className="gallery">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
