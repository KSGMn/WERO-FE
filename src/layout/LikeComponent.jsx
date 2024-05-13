import React, { useContext } from "react";
import DesignGrid from "../components/DesignGrid/DesignGrid";
import { AuthContext, useUser } from "../context/AuthContext";
import { useFeeds } from "../context/FeedContext";

const LikeComponent = () => {
  const { LikeFeeds, toggleLike, loading } = useFeeds();

  if (loading) {
    return <div className="center-message"></div>;
  }

  if (LikeFeeds.length === 0 && loading === false) {
    return <div className="center-message">좋아하는 피드가 없습니다.</div>;
  }

  return (
    <div className="diaries-like">
      <DesignGrid feeds={LikeFeeds} toggleLike={toggleLike} />
    </div>
  );
};

export default LikeComponent;
