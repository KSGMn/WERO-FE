import React from "react";
import Card from "../Card/Card";

const Pin = (props) => {
  const pinClass = `pin ${props.size}`;

  return (
    <div className={`${pinClass} d-flex`}>
      <Card
        diary_id={props.diary_id}
        isBookmarked={props.isBookmarked}
        isLiked={props.isLiked}
        content={props.content}
        trackName={props.trackName}
      />
    </div>
  );
};

export default Pin;
