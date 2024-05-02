import React, { useContext, useState } from "react";
import { SideBarData, SideBarIcon } from "./SideBarData";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";
import { AuthContext, useUser } from "../../context/AuthContext";

const SideBar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const { user } = useContext(AuthContext);

  return (
    <>
      <div className={`Sidebar ${isSidebarCollapsed ? "SidebarCollapsed" : ""}`}>
        <span className="close-btn text-white text-end m-2">
          {/* x아이콘 */}
          {SideBarIcon(toggleSidebar)[1].icon}
        </span>
        {/* 프로필 디자인 1 */}
        {/* ----------------------------------------------------------------- */}
        {/* <div className="profile ">
          <div className="profile-image-container text-center mb-3">
            <img
              src=""
              alt=""
              style={{
                width: "60px",
                height: "60px",
                background: "white",
                borderRadius: "50%",
              }}
            />
          </div>
          <div className="user-info text-center mb-3">
            <h4 className="text-white">User Name</h4>
            <p className="text-white">introduce</p>
          </div>
        </div>
        <div className="profile-btn-wraaper d-flex flex-row justify-content-center mb-3">
          <button className="profile-btn text-white">Edit</button>
          <button className="profile-btn text-white">Logout</button>
        </div> */}
        {/* ----------------------------------------------------------------- */}

        {/* 프로필 디자인2 */}
        {/* ----------------------------------------------------------------- */}
        <div className="container p-2 mb-3">
          {user.user_id === null || user.user_id === undefined || user.user_id === "" ? (
            <div className="d-flex flex-row justify-content-center ">
              <div className="sidebar-login-btn btn text-white" onClick={() => navigate("/login")}>
                Login
              </div>
              <div className="sidebar-signup-btn btn text-white" onClick={() => navigate("/signup")}>
                SignUp
              </div>
            </div>
          ) : (
            <div
              className="profile"
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
              }}
            >
              <img
                src=""
                alt=""
                style={{
                  width: "40px",
                  height: "40px",
                  background: "white",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "18px",
                  marginLeft: "8px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/mypage");
                }}
              />
              <div className="profile-text" style={{ flex: 70, maxWidth: "70%" }}>
                <div
                  className="text-white"
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {user.userName}
                </div>
                <div
                  className="text-white"
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {user.bio}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* ----------------------------------------------------------------- */}

        <ul className="SidebarList">
          {SideBarData.map((val, key) => (
            <li key={key} className="SidebarItem" onClick={() => (window.location.pathname = val.link)}>
              <div className="SidebarIcon">{val.icon}</div>
              <div className="SidebarTitle">{val.title}</div>
            </li>
          ))}
        </ul>
        <div className="SidebarItem mt-auto">
          <div className="SidebarIcon">{SideBarIcon()[2].icon}</div>
          <div className="SidebarTitle">Service center</div>
        </div>
      </div>
      <div
        className="btn-menu m-3 fs-3"
        style={{
          height: "35px",
          display: isSidebarCollapsed ? "block" : "none",
          color: "black",
        }}
        onClick={() => toggleSidebar()}
      >
        {/* 메뉴 아이콘 */}
        {SideBarIcon()[0].icon}
      </div>
    </>
  );
};

export default SideBar;
