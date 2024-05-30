import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import HomeComponent from "../layout/HomeComponent";
import "./WeRo.css";

import SearchBar from "../components/SearchBar/SearchBar";
import SideBar from "../components/SideBar/SideBar";
import MyPageComponent from "../layout/MyPageComponent";
import LoginComponent from "../layout/LoginComponent";
import SignupComponent from "../layout/SignupComponent.tsx";
import HistoryComponent from "../layout/HistoryComponent";
import LikeComponent from "../layout/LikeComponent";
import DiaryComponent from "../layout/DiaryComponent.jsx";
import OauthComponent from "../components/OauthComponent.tsx";
import ReadPostComponent from "../layout/ReadPostComponent.tsx";
import MyPageEditComponent from "../layout/MyPageEditComponent.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus } from "@fortawesome/free-solid-svg-icons";

import MoodyMatchComponent from "../layout/MoodyMatchComponent.jsx";
import ProfilePictureUpload from "../components/ProfilePictureUpload/ProfilePictureUpload.jsx";
import AdminComponent from "../layout/AdminComponent.jsx";
import ReportsComponent from "../components/Admin/ReportsComponent.jsx";
import SuspensionComponent from "../components/Admin/SuspensionComponent.jsx";
import SearchComponent from "../layout/SearchComponent.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import CategoryComponent from "../layout/CategoryComponent.jsx";
import SearchCategoryComponent from "../layout/SearchCategoryComponent.jsx";
import { useFeeds } from "../context/FeedContext.tsx";
import { AuthContext } from "../context/AuthContext.tsx";
import { useContext } from "react";

const WeRo = () => {
  const { authNavigate } = useContext(AuthContext);
  const { setPage } = useFeeds();
  const location = useLocation();
  const hideComponents = location.pathname === "/login" || location.pathname === "/signup";
  const homeBtn = () => {
    setPage(0);
  };

  return (
    <div className="d-flex flex-row" style={{ height: "100vh", width: "auto" }}>
      {!hideComponents && <SideBar />}
      <div className="main-page d-flex flex-column" style={{ flexGrow: "1", overflowY: "auto" }}>
        <div
          className="top-bar d-flex flex-row justify-content-between w-100"
          style={{ height: "70px", marginBottom: "50px", padding: "16px" }}
        >
          <Link to="/" className="home-btn">
            <div
              className="home-btn d-flex align-items-center ms-3"
              onClick={() => {
                homeBtn();
              }}
            >
              WeRo
            </div>
          </Link>

          {!hideComponents && (
            <div className="search-and-wirte me-3 d-flex align-items-center">
              {location.pathname.includes("/diary") ? (
                <Link to="/diary/edit/-1" className="add-icon">
                  일기쓰기
                  <FontAwesomeIcon className="ms-2" icon={faPlus} />
                </Link>
              ) : (
                <Link to="/edit/-1" className="add-icon">
                  글쓰기
                  <FontAwesomeIcon className="ms-2" icon={faPlus} />
                </Link>
              )}
              <SearchBar />
            </div>
          )}
        </div>

        <div className="main-screen" style={{ flexGrow: "1" }}>
          <Routes>
            <Route path="/" element={<HomeComponent />}>
              <Route path="/read/:id" element={<ReadPostComponent />} />
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <ReadPostComponent />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/search/:query" element={<SearchComponent />}>
              <Route path="read/:id" element={<ReadPostComponent />} />
              <Route path="edit/:id" element={<ReadPostComponent />} />
            </Route>
            <Route path="/category" element={<CategoryComponent />} />
            <Route path="/category/search/:query" element={<SearchCategoryComponent />}>
              <Route path="read/:id" element={<ReadPostComponent />} />
              <Route path="edit/:id" element={<ReadPostComponent />} />
            </Route>
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <MyPageComponent />
                </ProtectedRoute>
              }
            >
              {/* 기본 페이지로 HistoryComponent 렌더링 */}
              <Route index element={<HistoryComponent />} />
              <Route path="history" element={<HistoryComponent />} />
              <Route path="likes" element={<LikeComponent />} />
              <Route path="read/:id" element={<ReadPostComponent />} />
              <Route path="edit/:id" element={<ReadPostComponent />} />
              <Route path="history/read/:id" element={<ReadPostComponent />} />
              <Route path="histroy/edit/:id" element={<ReadPostComponent />} />
              <Route path="likes/read/:id" element={<ReadPostComponent />} />
              <Route path="likes/edit/:id" element={<ReadPostComponent />} />
              <Route path="prof/update" element={<ProfilePictureUpload />} />
            </Route>
            <Route
              path="/diary"
              element={
                <ProtectedRoute>
                  <DiaryComponent />
                </ProtectedRoute>
              }
            >
              <Route path="read/:id" element={<ReadPostComponent />} />
              <Route path="edit/:id" element={<ReadPostComponent />} />
            </Route>
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryComponent />
                </ProtectedRoute>
              }
            >
              <Route path="read/:id" element={<ReadPostComponent />} />
              <Route path="edit/:id" element={<ReadPostComponent />} />
            </Route>
            <Route
              path="/likes"
              element={
                <ProtectedRoute>
                  <LikeComponent />
                </ProtectedRoute>
              }
            >
              <Route path="read/:id" element={<ReadPostComponent />} />
              <Route path="edit/:id" element={<ReadPostComponent />} />
            </Route>
            <Route
              path="/mypage/edit"
              element={
                <ProtectedRoute>
                  <MyPageEditComponent />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route
              path="/moody-match"
              element={
                <ProtectedRoute>
                  <MoodyMatchComponent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminComponent />
                </ProtectedRoute>
              }
            >
              <Route index element={<ReportsComponent />} />
              <Route path="reports" element={<ReportsComponent />} />
              <Route path="user/suspension" element={<SuspensionComponent />} />
            </Route>

            <Route
              path="/auth/oauth2-response/:token/:expirationTime"
              element={
                <ProtectedRoute>
                  <OauthComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default WeRo;
