import React from "react";
import { useUser } from "../context/UserContext";
import DesignGrid from "../components/DesignGrid/DesignGrid";

const HistoryComponent = () => {
  const { diary, user } = useUser();

  const userDiaries = diary.filter((d) => d.user_id === user.User.user_id);

  return (
    <div>
      <DesignGrid diary={userDiaries} />
    </div>
  );
};

export default HistoryComponent;
