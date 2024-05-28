import DesignGrid from "../components/DesignGrid/DesignGrid";
import { useFeeds } from "../context/FeedContext";
import { Outlet } from "react-router-dom";

const DiaryComponent = () => {
  const { diaries, toggleBookmark, loading } = useFeeds();

  if (loading) {
    return <div className="center-message">로딩 중...</div>;
  }

  let message = null;

  if (diaries === undefined) {
    message = <div className="center-message">일기를 불러오지 못했습니다.</div>;
  } else if (diaries.length === 0) {
    message = <div className="center-message">작성한 일기가 없습니다.</div>;
  }

  return (
    <div className="diaries">
      {message}
      {diaries && diaries.length > 0 && <DesignGrid feeds={diaries} toggleBookmark={toggleBookmark} />}
      <Outlet />
    </div>
  );
};

export default DiaryComponent;
