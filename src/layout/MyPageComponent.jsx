import React from "react";
import MyPage from "../components/MyPage/MyPage";
import HistoryComponent from "./HistoryComponent";
import LikeComponent from "./LikeComponent";

const MyPageComponent = () => {
  return (
    <div className="mypage">
      <MyPage
        HistoryPage={<HistoryComponent />}
        LikesPage={<LikeComponent />}
      />
    </div>
  );
};

export default MyPageComponent;
