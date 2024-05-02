import React, { useContext } from "react";
import DesignGrid from "../components/DesignGrid/DesignGrid";
import { AuthContext, useUser } from "../context/AuthContext";

const HomeComponent = () => {
  const { diary } = useContext(AuthContext);

  return (
    <div className="peed ">
      <DesignGrid diary={diary} />
    </div>
  );
};

export default HomeComponent;
