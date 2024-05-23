import React, { useContext, useEffect, useState } from "react";
import "./MyPage.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import HistoryComponent from "../../layout/HistoryComponent";
import LikeComponent from "../../layout/LikeComponent";

const MyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, unlink_res, loading } = useContext(AuthContext);

  console.log(user.platform_type);

  const handleLogout = async () => {
    // if (user.platform_type === "kakao") {
    //   const result = await unlink_res();
    //   if (result) {
    //     navigate("/"); // 성공적으로 로그아웃 했으면 홈 페이지로 이동
    //   } else {
    //     alert("로그아웃에 실패하였습니다.");
    //   }
    //   return;
    // }

    const result = await logout(); // 로그아웃 함수 호출
    if (result) {
      navigate("/"); // 성공적으로 로그아웃 했으면 홈 페이지로 이동
    } else {
      alert("로그아웃에 실패하였습니다.");
      return;
    }
  };

  return (
    <div className="container">
      <div className="profile d-flex flex-column align-items-center" style={{ height: "auto" }}>
        <div className="profile-image-container mb-3">
          {user.profile_image !== "http://localhost:8080/uploads/undefined" ? (
            <img
              src={user.profile_image}
              alt=""
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onClick={() => {
                navigate("/mypage/prof/update");
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
              onClick={() => {
                navigate("/mypage/prof/update");
              }}
            >
              {user.userName}
            </div>
          )}
        </div>
        <div className="user-info text-center ">
          {user.profile_image !== "" ? <h4 className="text-black">{user.userName}</h4> : null}
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
        <div className="gallery"></div>
      </div>
    </div>
  );
};

export default MyPage;
