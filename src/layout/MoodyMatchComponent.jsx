import { useContext, useState } from "react";
import Card from "../components/Card/Card";
import { useFeeds } from "../context/FeedContext";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { transform } from "typescript";
import "../components/MoodyMatch/MoodyMatch.css";

const MoodyMatchComponent = () => {
  const { MoodyMatchFeeds, toggleLike, loading } = useFeeds();
  const { user } = useContext(AuthContext);
  const [likedStates, setLikedStates] = useState(Array(MoodyMatchFeeds.length).fill(false));
  const [moodyIndex, setMoodyIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [showNextCard, setShowNextCard] = useState(false);
  const [cardCount, setCardCount] = useState(0);

  if (loading) {
    return <div className="center-message">로딩 중...</div>;
  }

  let message = null;

  if (MoodyMatchFeeds === undefined) {
    message = <div className="center-message">피드를 불러오지 못했습니다.</div>;
  } else if (MoodyMatchFeeds && MoodyMatchFeeds.length === 0) {
    message = <div className="center-message">작성된 피드가 없습니다.</div>;
  }

  if (moodyIndex === MoodyMatchFeeds.length) {
    return <div className="center-message">모든 피드를 보셨습니다.</div>;
  }

  const handleSwipe = (direction) => {
    if (MoodyMatchFeeds && MoodyMatchFeeds.length > 0) {
      cardCount === 0 ? setCardCount(1) : setCardCount(0);
      setSwipeDirection(direction);
      setTimeout(() => {
        setSwipeDirection("");
        setShowNextCard(true);
        setMoodyIndex(moodyIndex + 1);
      }, 500);
    }
  };

  const isLikeClickBtn = (direction) => {
    handleSwipe(direction);
    if (showNextCard === true) setShowNextCard(false);
    if (direction === "like") {
      toggleLike(MoodyMatchFeeds[moodyIndex].mainfeed_id, MoodyMatchFeeds[moodyIndex].liked);

      setLikedStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[moodyIndex] = !newStates[moodyIndex];
        return newStates;
      });
      return;
    } else if (direction === "hate") {
      setMoodyIndex(moodyIndex + 1);
    }
  };

  const btnStyle = {
    borderRadius: "50%", // 원형 모양
    width: "90px", // 버튼의 너비
    height: "90px", // 버튼의 높이
    display: "flex", // flexbox를 사용하여 아이콘을 중앙에 위치
    justifyContent: "center",
    alignItems: "center",
    border: "none",
  };

  const renderInteractiveArea = () => {
    const iconStyle = likedStates[moodyIndex] ? { color: "red" } : {};
    return (
      <div className="card-icons">
        <FontAwesomeIcon icon={likedStates[moodyIndex] ? fasHeart : farHeart} style={iconStyle} />
      </div>
    );
  };

  return (
    <div
      style={{
        height: "700px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {message}
      <div className="card-stack">
        {MoodyMatchFeeds && MoodyMatchFeeds.length > 0 && cardCount === 0 && (
          <div className={`moody-card ${swipeDirection}`}>
            <Card
              key={moodyIndex}
              mainfeed_id={MoodyMatchFeeds[moodyIndex].mainfeed_id}
              isLiked={MoodyMatchFeeds[moodyIndex].liked}
              content={MoodyMatchFeeds[moodyIndex].content}
              image={MoodyMatchFeeds[moodyIndex].image}
              user_id={user.user_id}
              cardClickHandler={null}
              toggleLike={null}
            />
          </div>
        )}
        {MoodyMatchFeeds && MoodyMatchFeeds.length > 1 && cardCount === 1 && (
          <div className={`moody-card next ${swipeDirection}`}>
            <Card
              key={moodyIndex}
              mainfeed_id={MoodyMatchFeeds[moodyIndex].mainfeed_id}
              isLiked={MoodyMatchFeeds[moodyIndex].liked}
              content={MoodyMatchFeeds[moodyIndex].content}
              image={MoodyMatchFeeds[moodyIndex].image}
              user_id={user.user_id}
              cardClickHandler={null}
              toggleLike={null}
            />
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "20%",
          width: "500px",
          padding: "16px 0px",
        }}
      >
        <button className="hate-and-like-btn" type="button" style={btnStyle}>
          <FontAwesomeIcon className="fs-3" icon={faXmark} onClick={() => isLikeClickBtn("hate")} />
        </button>
        <button
          type="button"
          className="hate-and-like-btn fs-3"
          style={btnStyle}
          onClick={() => isLikeClickBtn("like")}
        >
          {renderInteractiveArea()}
        </button>
      </div>
    </div>
  );
};

export default MoodyMatchComponent;
