import React, { useContext } from "react";
import { AuthContext, useUser } from "../context/AuthContext";
import DesignGrid from "../components/DesignGrid/DesignGrid";

const HistoryComponent = () => {
  const { user, diary } = useContext(AuthContext);

  const userDiaries = diary.filter((d) => d.user_id === user.user_id);

  return (
    <div>
      <DesignGrid diary={userDiaries} />
    </div>
  );
};

export default HistoryComponent;
