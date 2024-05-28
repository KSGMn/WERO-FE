import DesignGrid from "../components/DesignGrid/DesignGrid";
import { useFeeds } from "../context/FeedContext";
import { Outlet } from "react-router-dom";

const LikeComponent = () => {
  const { LikeFeeds, toggleLike, loading } = useFeeds();

  if (loading) {
    return <div className="center-message">로딩 중...</div>;
  }

  let message = null;

  if (LikeFeeds === undefined) {
    message = <div className="center-message">피드를 불러오지 못했습니다.</div>;
  } else if (LikeFeeds.length === 0) {
    message = <div className="center-message">좋아요한 피드가 없습니다.</div>;
  }
  return (
    <div className="diaries-like">
      {message}
      {LikeFeeds && LikeFeeds.length > 0 && <DesignGrid feeds={LikeFeeds} toggleLike={toggleLike} />}
      <Outlet />
    </div>
  );
};

export default LikeComponent;
