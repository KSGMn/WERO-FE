import React, { useContext } from "react";
import DesignGrid from "../components/DesignGrid/DesignGrid";
import { AuthContext, useUser } from "../context/AuthContext";
import { useFeeds } from "../context/FeedContext";
import { Outlet } from "react-router-dom";

const LikeComponent = () => {
  const { LikeFeeds, toggleLike, loading } = useFeeds();

  if (LikeFeeds === undefined) {
    return <div className="center-message">피드를 불러오지 못했습니다.</div>;
  }

  if (loading) {
    return <div className="center-message"></div>;
  }

  if (LikeFeeds.length === 0 && loading === false) {
    return <div className="center-message">좋아하는 피드가 없습니다.</div>;
  }

  return (
    <div className="diaries-like">
      <DesignGrid feeds={LikeFeeds} toggleLike={toggleLike} />
      <Outlet />
    </div>
  );
};

export default LikeComponent;
