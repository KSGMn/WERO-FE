import React, { useEffect, useRef } from "react";
import "./DesignGrid.css";
import Pin from "./Pin.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const DesignGrid = ({ feeds, toggleLike, toggleBookmark, loadMoreFeeds, hasMore }) => {
  const { query } = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  const sizes = ["small", "medium", "large"];

  // const getRandomSize = () => {
  //   return sizes[Math.floor(Math.random() * sizes.length)];
  // };

  const observerTarget = useRef();
  const observer = useRef();

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect(); // 이전 옵저버 해제
    }

    const options = {
      threshold: 1.0,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMoreFeeds();
        }
      });
    };

    observer.current = new IntersectionObserver(callback, options);

    if (observerTarget.current) {
      observer.current.observe(observerTarget.current);
    }
  }, [loadMoreFeeds, feeds]);

  let path = "";

  if (location.pathname === "/mypage") {
    path = "/mypage";
  }

  if (location.pathname === "/mypage/history") {
    path = "/mypage/history";
  }

  if (location.pathname === "/mypage/likes") {
    path = "/mypage/likes";
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
  if (location.pathname.includes("search")) {
    path = `/search/${query}`;
  }
  if (location.pathname.includes("/category/search/")) {
    path = `/category/search/${query}`;
  }

  const cardClickHandler = (feedId, content, trackName, image, category, createDate, isLiked, userId, isBookmarked) => {
    if (location.pathname === "/category") {
      navigate(`/category/search/${content}`);
      return;
    }
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
          <React.Fragment key={feed.mainfeed_id || feed.diaryId || index}>
            <Pin
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
              toggleBookmark={toggleBookmark}
            />
            {(index + 1) % 300 === 0 && (
              <div
                ref={index === feeds.length - 1 ? observerTarget : null}
                className="red-line"
                key={`red-line-${feed.mainfeed_id || feed.diaryId}-${index}`}
                style={{ height: "1px" }}
              />
            )}
          </React.Fragment>
        ))
      ) : (
        <p>No diaries found.</p>
      )}
    </div>
  );
};

export default DesignGrid;
