import { Outlet } from "react-router-dom";
import DesignGrid from "../components/DesignGrid/DesignGrid";
import { useFeeds } from "../context/FeedContext";

const HistoryComponent = () => {
  const { MyFeeds, loading, toggleLike, loadMoreFeeds } = useFeeds();

  if (loading) {
    return <div className="center-message">로딩 중...</div>;
  }

  let message = null;

  if (MyFeeds === undefined) {
    message = <div className="center-message">피드를 불러오지 못했습니다.</div>;
  } else if (MyFeeds.length === 0) {
    message = <div className="center-message">작성한 피드가 없습니다.</div>;
  }

  return (
    <div className="myfeed">
      {message}
      {MyFeeds && MyFeeds.length > 0 && (
        <DesignGrid feeds={MyFeeds} toggleLike={toggleLike} loadMoreFeeds={loadMoreFeeds} />
      )}
      <Outlet />
    </div>
  );
};

export default HistoryComponent;
