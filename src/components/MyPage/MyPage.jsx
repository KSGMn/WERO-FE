import React, { useContext, useEffect, useState } from "react";
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
      alert("로그아웃에 실패하였습니다.");
    }
  };

  const encodedFileName = "%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3.jpeg";
  const decodedFileName = decodeURIComponent(encodedFileName);
  const imageUrl = `http://localhost:8080/uploads/${decodedFileName}`;

  return (
    <div className="container">
      <div className="profile d-flex flex-column align-items-center" style={{ height: "auto" }}>
        <div className="profile-image-container mb-3">
          {user.profile_image !== "" ? (
            <img
              src={imageUrl}
              alt=""
              style={{
                width: "120px",
                height: "120px",
                //background: "black",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "black",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "36px",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
              }}
            >
              {user.userName}
            </div>
          )}
        </div>
        <div className="user-info text-center ">
          {user.profile_image !== "" ? <h4 className="text-black">{user.userName}</h4> : null}
          <p className="text-black m-0">{user.bio}</p>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <div className="el-btn btn" onClick={() => navigate("/mypage/edit")}>
          Edit
        </div>
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
