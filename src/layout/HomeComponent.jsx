import React from "react";
import DesignGrid from "../components/DesignGrid/DesignGrid";
import { useUser } from "../context/UserContext";

const HomeComponent = () => {
  const { diary } = useUser();

  return (
    <div className="peed ">
      <DesignGrid diary={diary} />
    </div>
  );
};

export default HomeComponent;
