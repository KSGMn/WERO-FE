import "./DesignGrid.css";
import Pin from "./Pin.js";
import { useLocation, useNavigate } from "react-router-dom";

const DesignGrid = ({ feeds, toggleLike }) => {
  const navigate = useNavigate();

  const location = useLocation();

  const sizes = ["small", "medium", "large"];

  // const getRandomSize = () => {
  //   return sizes[Math.floor(Math.random() * sizes.length)];
  // };

  if (!feeds || !feeds.length) {
    return <p>데이터가 없습니다.</p>;
  }

  const cardClickHandler = (
    feedId,
    content,
    trackName,
    category,
    createDate,
    isLiked,
    userId,
    isRequesting,
    setIsRequesting,
    feedState,

    setFeedState
  ) => {
    console.log("클릭한 일기 아이디", feedId, content, trackName, category, createDate, isLiked, userId);
    navigate(`/read/${feedId}`, {
      state: {
        content,
        trackName,
        category,
        createDate,
        isLiked,
        userId,
        isRequesting,
        setIsRequesting,
        feedState,
        setFeedState,
      },
    });
  };

  const cardClickHandlerInMyPage = (
    feedId,
    content,
    trackName,
    category,
    createDate,
    isLiked,
    userId,
    isRequesting,
    setIsRequesting,
    feedState,

    setFeedState
  ) => {
    console.log("클릭한 일기 아이디", feedId, content, trackName, category, createDate, isLiked, userId);
    navigate(`/mypage/read/${feedId}`, {
      state: {
        content,
        trackName,
        category,
        createDate,
        isLiked,
        userId,
        isRequesting,
        setIsRequesting,
        feedState,
        setFeedState,
      },
    });
  };

  return (
    <div className="pin_container">
      {feeds.length > 0 ? (
        feeds.map((feed, index) => (
          <Pin
            key={feed.mainfeed_id}
            mainfeed_id={feed.mainfeed_id}
            size={sizes[index % sizes.length]}
            isLiked={feed.liked}
            content={feed.content}
            trackName={feed.trackName}
            toggleLike={toggleLike}
            cardClickHandler={
              location.pathname.includes("/mypage")
                ? () =>
                    cardClickHandlerInMyPage(
                      feed.mainfeed_id,
                      feed.content,
                      feed.trackName,
                      feed.category,
                      feed.create_date,
                      feed.liked,
                      feed.user_id
                    )
                : () =>
                    cardClickHandler(
                      feed.mainfeed_id,
                      feed.content,
                      feed.trackName,
                      feed.category,
                      feed.create_date,
                      feed.liked,
                      feed.user_id
                    )
            }
          />
        ))
      ) : (
        <p>No diaries found.</p>
      )}
    </div>
  );
};

export default DesignGrid;
