import DesignGrid from "../components/DesignGrid/DesignGrid";
import { Outlet } from "react-router-dom";
import { useFeeds } from "../context/FeedContext";

const HomeComponent = () => {
  const { feeds, loading, toggleLike, loadMoreFeeds } = useFeeds();

  if (loading) {
    return <div className="center-message">로딩 중...</div>;
  }

  let message = null;

  if (feeds === undefined) {
    message = <div className="center-message">피드를 불러오지 못했습니다.</div>;
  } else if (feeds.length === 0) {
    message = <div className="center-message">작성된 피드가 없습니다.</div>;
  }

  return (
    <div className="feed ">
      {message}
      {feeds && feeds.length > 0 && <DesignGrid feeds={feeds} toggleLike={toggleLike} loadMoreFeeds={loadMoreFeeds} />}

      <Outlet />
    </div>
  );
};

export default HomeComponent;
