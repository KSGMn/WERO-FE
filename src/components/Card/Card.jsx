import React, { useState } from "react";
import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as fasBookmark,
  faHeart as fasHeart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark as farBookmark,
  faHeart as farHeart,
} from "@fortawesome/free-regular-svg-icons";
import { useLocation } from "react-router-dom";

const Card = ({ diary_id, isBookmarked, isLiked, content, trackName }) => {
  const [Bookmarked, setBookmarked] = useState(isBookmarked);
  const [Liked, setLiked] = useState(isLiked);
  const [isContent, setContent] = useState(content);
  const [isTitle, setTitle] = useState(trackName);
  const location = useLocation();

  const diaryId = diary_id;

  const toggleBookmark = () => setBookmarked(!Bookmarked);
  const toggleLike = () => setLiked(!Liked);

  const isAddMode = location.pathname.includes("/cardadd");
  const isUpdateMode = location.pathname.includes("/cardupdate");

  const renderInteractiveArea = () => {
    if (!isAddMode && !isUpdateMode) {
      return (
        <div className="card-icons">
          <button
            aria-label="Bookmark"
            className="icon-button"
            onClick={toggleBookmark}
          >
            <FontAwesomeIcon icon={isBookmarked ? fasBookmark : farBookmark} />
          </button>
          <button
            aria-label="Like"
            className="icon-button"
            onClick={toggleLike}
          >
            <FontAwesomeIcon icon={isLiked ? fasHeart : farHeart} />
          </button>
        </div>
      );
    }
    return null;
  };

  const inputStyle = {
    border: "none",
    backgroundColor: "transparent",
    width: "100%",
    color: "black",
    outline: "none",
    padding: "12px",
    textAlign: "center",
    height: "80%",
  };

  const renderTitle = () => {
    const handleTitleChange = (event) => {
      setTitle(event.target.value); // 상태 업데이트 함수
    };
    if (isAddMode || isUpdateMode) {
      return (
        <input
          className={isAddMode ? "input-title-with-placeholder" : ""}
          type="text"
          placeholder={isAddMode ? "제목을 입력하세요" : ""}
          value={isAddMode ? trackName : isTitle}
          onChange={handleTitleChange}
          style={inputStyle}
        />
      );
    }
    return <p>{isTitle}</p>;
  };

  const renderContent = () => {
    const handleContentChange = (event) => {
      setContent(event.target.value); // 상태 업데이트 함수
    };
    if (isAddMode) {
      return (
        <input
          className="input-content-with-placeholder"
          type="text"
          placeholder="내용을 입력하세요"
          style={{ ...inputStyle, display: "flex", justifyContent: "center" }}
        />
      );
    } else if (isUpdateMode) {
      return (
        <input
          className="input-content-with-placeholder"
          type="text"
          value={isContent}
          onChange={handleContentChange}
          style={{ ...inputStyle, display: "flex", justifyContent: "center" }}
        />
      );
    }
    return <span className="card-content">{isContent}</span>;
  };

  return (
    <div className="card">
      <div className="card-header">
        {renderInteractiveArea()}
        {renderContent()}
      </div>
      <div className="card-title">{renderTitle()}</div>
    </div>
  );
};

export default Card;
