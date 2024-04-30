import React from "react";
import "./DesignGrid.css";
import Pin from "./Pin.js";

const DesignGrid = ({ diary }) => {
  const sizes = ["small", "medium", "large"];

  const getRandomSize = () => {
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  if (!diary || !diary.length) {
    return <p>데이터가 없습니다.</p>;
  }
  return (
    <div className="pin_container">
      {diary.length > 0 ? (
        diary.map((d) => (
          <Pin
            key={d.diary_id}
            size={getRandomSize()}
            isBookmarked={d.isBookmarked}
            isLiked={d.isLiked}
            content={d.content}
            trackName={d.trackName}
          />
        ))
      ) : (
        <p>No diaries found.</p>
      )}
    </div>
  );
};

export default DesignGrid;
