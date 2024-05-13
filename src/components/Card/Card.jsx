import { useContext, useState } from "react";
import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark, faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark, faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { feedAddLike, feedDeleteLike } from "../../api";

const Card = ({ mainfeed_id, isLiked, content, trackName, user_id, cardClickHandler, toggleLike }) => {
  //const [Bookmarked, setBookmarked] = useState(isBookmarked);
  const [Liked, setLiked] = useState(isLiked);
  const [isContent, setContent] = useState(content);
  const [isTitle, setTitle] = useState(trackName);
  const location = useLocation();
  const [isRequesting, setIsRequesting] = useState(false);

  //const toggleBookmark = () => setBookmarked(!Bookmarked);
  const { user } = useContext(AuthContext);

  // const toggleLike = async () => {
  //   if (isRequesting) return; // 이미 요청 중이면 무시
  //   setIsRequesting(true);
  //   try {
  //     // 좋아요 상태를 토글하고 서버 응답을 기다림
  //     const response = await (!Liked
  //       ? feedAddLike(user.user_id, mainfeed_id)
  //       : feedDeleteLike(user.user_id, mainfeed_id));

  //     if (response.code === "SU") {
  //       setLiked((isLiked) => !isLiked); // 상태 업데이트를 통해 컴포넌트만 리렌더링
  //     } else {
  //       console.error("Failed to toggle like");
  //     }
  //   } catch (error) {
  //     console.error("Error toggling like", error);
  //   } finally {
  //     setIsRequesting(false); // 요청 완료 후 상태 업데이트
  //   }
  // };

  const getToggleLikeFunction = () => {
    if (isRequesting) return; // 이미 요청 중이면 무시
    setIsRequesting(true);

    try {
      console.log("toggleLike 호출 전: ", mainfeed_id, Liked);
      toggleLike(mainfeed_id, Liked);
      setLiked(!Liked);
    } catch (error) {
      console.error("Error toggling like", error);
    } finally {
      setIsRequesting(false); // 요청 완료 후 상태 업데이트
    }
  };

  const isAddMode = location.pathname.includes("/edit/-1");
  const isUpdateMode = location.pathname.includes(`/edit/${mainfeed_id}`);
  const isReadMode = location.pathname.startsWith("/read/");
  const isMoodyMatchMode = location.pathname.includes("/moody-match");

  const renderInteractiveArea = () => {
    const className =
      isAddMode || isUpdateMode || isMoodyMatchMode ? "card-icons hidden-but-occupy-space" : "card-icons";
    const iconStyle = Liked ? { color: "red" } : {};

    return (
      <div className={className}>
        {/* <button aria-label="Bookmark" className="icon-button" onClick={toggleBookmark}>
          <FontAwesomeIcon icon={isBookmarked ? fasBookmark : farBookmark} />
        </button> */}
        <button aria-label="Like" className="icon-button" onClick={getToggleLikeFunction}>
          <FontAwesomeIcon icon={Liked ? fasHeart : farHeart} style={iconStyle} />
        </button>
      </div>
    );
  };

  const cardStyle = {
    cursor: isAddMode || isUpdateMode || isReadMode || isMoodyMatchMode ? "defaul" : "pointer",
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
    if (isAddMode) {
      return (
        <input
          className={"input-title-with-placeholder"}
          type="text"
          placeholder={"제목을 입력하세요"}
          value={isTitle}
          onChange={handleTitleChange}
          style={inputStyle}
        />
      );
    } else if (isUpdateMode) {
      return <input type="text" value={isTitle} onChange={handleTitleChange} style={inputStyle} />;
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
    return (
      <span className="card-content" style={cardStyle} onClick={cardClickHandler}>
        {isContent}
      </span>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        {renderInteractiveArea()}
        {renderContent()}
      </div>
      <div className="card-title" onClick={cardClickHandler} style={cardStyle}>
        {renderTitle()}
      </div>
    </div>
  );
};

export default Card;
