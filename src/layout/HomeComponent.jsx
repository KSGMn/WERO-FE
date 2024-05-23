import DesignGrid from "../components/DesignGrid/DesignGrid";
import { Outlet } from "react-router-dom";
import { useFeeds } from "../context/FeedContext";
import { useEffect, useRef } from "react";

const HomeComponent = () => {
  const { feeds, loading, toggleLike, loadMoreFeeds, hasMore } = useFeeds();

  if (feeds === undefined) {
    return <div className="center-message">피드를 불러오지 못했습니다.</div>;
  }

  if (loading) {
    return <div className="center-message"></div>;
  }

  if (feeds.length === 0 && loading === false) {
    return <div className="center-message">생성된 피드가 없습니다.</div>;
  }

  return (
    <div className="feed ">
      <DesignGrid feeds={feeds} toggleLike={toggleLike} loadMoreFeeds={loadMoreFeeds} />

      <Outlet />
    </div>
  );
};

export default HomeComponent;
