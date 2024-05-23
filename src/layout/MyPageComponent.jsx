import React from "react";
import MyPage from "../components/MyPage/MyPage";
import HistoryComponent from "./HistoryComponent";
import LikeComponent from "./LikeComponent";
import { Outlet } from "react-router-dom";

const MyPageComponent = () => {
  return (
    <div className="mypage">
      <MyPage />
      <Outlet />
    </div>
  );
};

export default MyPageComponent;
