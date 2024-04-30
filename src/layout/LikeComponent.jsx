import React from "react";
import DesignGrid from "../components/DesignGrid/DesignGrid";
import { useUser } from "../context/UserContext";

const LikeComponent = () => {
  const { diary, user } = useUser();

  const userLikeDiaries = diary.filter(
    (d) => d.isLiked === true && d.user_id === user.User.user_id
  );

  return (
    <div className="diaries-like">
      <DesignGrid diary={userLikeDiaries} />
    </div>
  );
};

export default LikeComponent;
