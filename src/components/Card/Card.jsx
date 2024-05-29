import { useContext, useEffect, useRef, useState } from "react";
import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark, faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark, faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { backgroundColorSelector, backgroundImageSelector } from "../Modal/BackgroundSelector";

const Card = ({
  id,
  isLiked,
  content,
  trackName,
  image,
  cardClickHandler,
  toggleLike,
  isBookmarked,
  toggleBookmark,
}) => {
  const [Bookmarked, setBookmarked] = useState(isBookmarked);
  const [Liked, setLiked] = useState(isLiked);
  // const [isContent, setContent] = useState(content);
  // const [isTitle, setTitle] = useState(trackName);
  const location = useLocation();
  const [isRequesting, setIsRequesting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const placeholder = "내용을 입력하세요";
      const contentLength = content ? content.length : 0;
      const placeholderLength = placeholder.length;
      const widthLength = contentLength > 0 ? contentLength : placeholderLength;
      inputRef.current.style.width = `${widthLength + 5}ch`;
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [content]);

  const { user } = useContext(AuthContext);

  const toggleBookmarkFunction = () => {
    if (isRequesting) return; // 이미 요청 중이면 무시
    setIsRequesting(true);
    try {
      toggleBookmark(id.toString());
      setBookmarked(Bookmarked === 1 ? 0 : 1);
    } catch (error) {
      console.error("Error toggling bookmark", error);
    } finally {
      setIsRequesting(false); // 요청 완료 후 상태 업데이트
    }
  };

  const getToggleLikeFunction = () => {
    if (user.user_id === "") return alert("로그인 후 이용 가능합니다");
    if (isRequesting) return; // 이미 요청 중이면 무시
    setIsRequesting(true);

    try {
      toggleLike(id, Liked);
      setLiked(!Liked);
    } catch (error) {
      console.error("Error toggling like", error);
    } finally {
      setIsRequesting(false); // 요청 완료 후 상태 업데이트
    }
  };

  const isAddMode = location.pathname.includes("/edit/-1");
  const isUpdateMode = location.pathname.includes(`/edit/${id}`);
  const isReadMode = location.pathname.includes(`/read/${id}`);
  const isMoodyMatchMode = location.pathname.includes("/moody-match");
  const isDiaryMode = location.pathname.includes("/diary");

  const renderInteractiveArea = () => {
    const className =
      isAddMode || isUpdateMode || isMoodyMatchMode ? "card-icons hidden-but-occupy-space" : "card-icons";
    const iconStyle = Liked ? { color: "red" } : {};

    if (location.pathname === "/category") {
      return (
        <button aria-label="Like" className="icon-button" style={{ visibility: "hidden" }}>
          <FontAwesomeIcon icon={Liked ? fasHeart : farHeart} style={iconStyle} />
        </button>
      );
    }

    if (location.pathname.includes("/diary")) {
      return (
        <div className={className}>
          <button aria-label="Bookmark" className="icon-button" onClick={toggleBookmarkFunction}>
            <FontAwesomeIcon icon={Bookmarked === 1 ? fasBookmark : farBookmark} />
          </button>
        </div>
      );
    } else {
      return (
        <div className={className}>
          <button aria-label="Like" className="icon-button" onClick={getToggleLikeFunction}>
            <FontAwesomeIcon icon={Liked ? fasHeart : farHeart} style={iconStyle} />
          </button>
        </div>
      );
    }
  };

  const cardStyle = {
    cursor: isAddMode || isUpdateMode || isReadMode || isMoodyMatchMode ? "defaul" : "pointer",
  };

  const renderTitle = () => {
    return (
      <input
        className={isDiaryMode ? "input-title-with-placeholder-diary-read" : "input-content-with-placeholder-read"}
        type="text"
        value={trackName}
        readOnly
      />
    );
  };

  const renderContent = () => {
    return (
      <span className="card-content" style={cardStyle} onClick={cardClickHandler}>
        <textarea
          ref={inputRef}
          className={isDiaryMode ? "input-content-with-placeholder-diary-read" : "input-content-with-placeholder-read"}
          type="text"
          value={content}
          readOnly
          rows={1}
        />
      </span>
    );
  };

  const bgColor = backgroundColorSelector(image);
  const bgImage = backgroundImageSelector(image);

  const cardBg = {
    backgroundColor: bgColor,
    backgroundImage: bgImage ? `url(${bgImage})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="card" style={cardBg}>
      <div className="card-header">
        {renderInteractiveArea()} {renderContent()}
      </div>
      {location.pathname.includes("/diary") && (
        <div className="card-title" onClick={cardClickHandler} style={cardStyle}>
          {renderTitle()}
        </div>
      )}
    </div>
  );
};

export default Card;
