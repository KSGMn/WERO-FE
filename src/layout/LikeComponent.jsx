import React, { useContext } from "react";
import DesignGrid from "../components/DesignGrid/DesignGrid";
import { AuthContext, useUser } from "../context/AuthContext";

const LikeComponent = () => {
  const { user, diary } = useContext(AuthContext);

  const userLikeDiaries = diary.filter((d) => d.isLiked === true && d.user_id === user.user_id);

  return (
    <div className="diaries-like">
      <DesignGrid diary={userLikeDiaries} />
    </div>
  );
};

export default LikeComponent;
