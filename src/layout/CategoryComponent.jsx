import React from "react";
import { useFeeds } from "../context/FeedContext";
import DesignGrid from "../components/DesignGrid/DesignGrid";

const CategoryComponent = () => {
  const { loading, toggleLike, loadMoreFeeds } = useFeeds();

  const categoryList = [
    { content: "행복", image: "pink" },
    { content: "슬픔", image: "blue" },
    { content: "기쁨", image: "green" },
    { content: "후회", image: "yellow" },
    { content: "평온", image: "orange" },
    { content: "분노", image: "purple" },
    { content: "공포", image: "gray" },
    { content: "놀람", image: "white" },
    { content: "사랑", image: "red" },
  ];

  if (loading) {
    return <div className="center-message">로딩 중...</div>;
  }

  let message = null;

  if (categoryList === undefined) {
    message = <div className="center-message">피드를 불러오지 못했습니다.</div>;
  } else if (categoryList.length === 0) {
    message = <div className="center-message">작성된 피드가 없습니다.</div>;
  }

  return (
    <div className="feed ">
      {message}
      {categoryList && categoryList.length > 0 && (
        <DesignGrid feeds={categoryList} toggleLike={toggleLike} loadMoreFeeds={loadMoreFeeds} />
      )}
    </div>
  );
};

export default CategoryComponent;
