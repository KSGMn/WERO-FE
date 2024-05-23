import React, { useContext } from "react";
import DesignGrid from "../components/DesignGrid/DesignGrid";
import { AuthContext, useUser } from "../context/AuthContext";
import { useFeeds } from "../context/FeedContext";
import { Outlet } from "react-router-dom";

const DiaryComponent = () => {
  const { diaries, toggleBookmark, loading } = useFeeds();

  if (diaries === undefined) {
    return <div className="center-message">피드를 불러오지 못했습니다.</div>;
  }

  if (loading) {
    return <div className="center-message"></div>;
  }

  if (diaries.length === 0 && loading === false) {
    return <div className="center-message">좋아하는 피드가 없습니다.</div>;
  }

  return (
    <div className="diaries">
      <DesignGrid feeds={diaries} toggleBookmark={toggleBookmark} />
      <Outlet />
    </div>
  );
};

export default DiaryComponent;
