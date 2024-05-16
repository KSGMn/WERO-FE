import { useContext, useState } from "react";
import Card from "../components/Card/Card";
import { useFeeds } from "../context/FeedContext";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart, faXmark, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const MoodyMatchComponent = () => {
  const { MoodyMatchFeeds, toggleLike, loading } = useFeeds();
  const { user } = useContext(AuthContext);
  const [likedStates, setLikedStates] = useState(Array(MoodyMatchFeeds.length).fill(false));
  const [moodyIndex, setMoodyIndex] = useState(0);

  if (MoodyMatchFeeds === undefined) {
    return <div className="center-message">피드를 불러오지 못했습니다.</div>;
  }

  if (loading) {
    return <div className="center-message"></div>;
  }

  if (MoodyMatchFeeds.length === 0 && loading === false) {
    return <div className="center-message">생성된 피드가 없습니다.</div>;
  }

  if (moodyIndex === MoodyMatchFeeds.length) {
    return <div className="center-message">모든 피드를 좋아요 하셨습니다.</div>;
  }

  const isLikeClickBtn = () => {
    toggleLike(MoodyMatchFeeds[moodyIndex].mainfeed_id, MoodyMatchFeeds[moodyIndex].liked);
    setMoodyIndex(moodyIndex + 1);
    setLikedStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[moodyIndex] = !newStates[moodyIndex];
      return newStates;
    });
  };

  const popBtn = () => {
    setMoodyIndex(moodyIndex + -1);
  };

  console.log(MoodyMatchFeeds);
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
      <div style={{ height: "80%", width: "500px", overflow: "hidden", position: "relative" }}>
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
        <button type="button" style={btnStyle}>
          <FontAwesomeIcon className="fs-3" icon={faXmark} />
        </button>
        {/* <button type="button" style={btnStyle}>
          <FontAwesomeIcon className="fs-3" icon={faRotateLeft} onClick={() => popBtn()} />
        </button> */}
        <button type="button" className="fs-3" style={btnStyle} onClick={() => isLikeClickBtn()}>
          {renderInteractiveArea()}
        </button>
      </div>
    </div>
  );
};

export default MoodyMatchComponent;
