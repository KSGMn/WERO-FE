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

  let path = "";

  if (location.pathname === "/mypage") {
    path = "/mypage";
  }

  if (location.pathname === "/diary") {
    path = "/diary";
  }
  if (location.pathname === "/history") {
    path = "/history";
  }
  if (location.pathname === "/likes") {
    path = "/likes";
  }

  const cardClickHandler = (feedId, content, trackName, image, category, createDate, isLiked, userId, isBookmarked) => {
    navigate(`${path}/read/${feedId}`, {
      state: {
        content,
        trackName,
        image,
        category,
        createDate,
        isLiked,
        userId,
        isBookmarked,
      },
    });
  };

  return (
    <div className="pin_container">
      {feeds.length > 0 ? (
        feeds.map((feed, index) => (
          <Pin
            key={feed.mainfeed_id || feed.diaryId}
            id={feed.mainfeed_id || feed.diaryId}
            size={sizes[index % sizes.length]}
            isLiked={feed.liked}
            content={feed.content || feed.diaryContent}
            trackName={feed.trackName || feed.song}
            image={feed.image}
            toggleLike={toggleLike}
            cardClickHandler={() =>
              cardClickHandler(
                feed.mainfeed_id || feed.diaryId,
                feed.content || feed.diaryContent,
                feed.trackName || feed.song,
                feed.image,
                feed.category || feed.emotion,
                feed.create_date,
                feed.liked,
                feed.user_id || feed.userId,
                feed.isBookmarked
              )
            }
            isBookmarked={feed.isBookmarked}
          />
        ))
      ) : (
        <p>No diaries found.</p>
      )}
    </div>
  );
};

export default DesignGrid;
