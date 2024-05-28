import { useContext, useState } from "react";
import { SideBarData, SideBarIcon } from "./SideBarData";
import "./SideBar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const SideBar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const location = useLocation();
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
              {user.profile_image !== "http://localhost:8080/uploads/undefined" ? (
                <img
                  src={user.profile_image}
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
                  onClick={() => (window.location.pathname = "/mypage")}
                />
              ) : (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "18px",
                    marginLeft: "8px",
                    cursor: "pointer",
                    color: "black", // 텍스트 색상 설정
                    fontSize: "12px", // 텍스트 크기 조절, 필요에 따라 조정
                    fontWeight: "bold",
                    overflow: "hidden", // 내용이 넘칠 때 숨기기
                    whiteSpace: "nowrap", // 줄바꿈 방지
                    textOverflow: "ellipsis", // 말줄임표 표시
                  }}
                  onClick={() => (window.location.pathname = "/mypage")}
                >
                  {user.userName}
                </div>
              )}
              <div className="profile-text" style={{ flex: 70, maxWidth: "70%" }}>
                {user.profile_image !== "" ? (
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
                ) : null}
              </div>
            </div>
          )}
        </div>
        {/* ----------------------------------------------------------------- */}

        <ul className="SidebarList">
          {SideBarData.map((val, key) => (
            <li
              key={key}
              className="SidebarItem"
              style={{ backgroundColor: location.pathname.includes(val.link) ? "#3f5060" : null }}
              onClick={() => (window.location.pathname = val.link)}
            >
              <div className="SidebarIcon">{val.icon}</div>
              <div className="SidebarTitle">{val.title}</div>
            </li>
          ))}
        </ul>
        {user.user_id === "admin" && (
          <div className="SidebarItem" onClick={() => (window.location.pathname = "/admin")}>
            <div className="SidebarIcon">{SideBarIcon()[3].icon}</div>
            <div className="SidebarTitle">Admin</div>
          </div>
        )}

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
