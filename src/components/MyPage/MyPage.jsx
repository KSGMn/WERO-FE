import React from "react";
import "./MyPage.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const MyPage = () => {
  const location = useLocation();

  const { user } = useUser();

  return (
    <div className="container">
      <div
        className="profile d-flex flex-column align-items-center"
        style={{ height: "auto" }}
      >
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
          <h4 className="text-black">{user.User.userName}</h4>
          <p className="text-black m-0">{user.User.bio}</p>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <div className="el-btn btn">Edit</div>
        <div className="el-btn btn">Logout</div>
      </div>

      <div
        className="gallery-btn d-flex flex-row justify-content-center"
        style={{ height: "auto" }}
      >
        <Link
          to="/mypage/history"
          className={`btn ${
            location.pathname === "/mypage/history" ||
            location.pathname === "/mypage"
              ? "custom-btn-click"
              : "custom-btn"
          }`}
        >
          History
        </Link>
        <Link
          to="/mypage/likes"
          className={`btn ${
            location.pathname === "/mypage/likes"
              ? "custom-btn-click"
              : "custom-btn"
          }`}
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
