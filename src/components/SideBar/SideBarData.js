import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faBars,
  faXmark,
  faHeadset,
  faBook,
  faHeart,
  faLayerGroup,
  faList,
} from "@fortawesome/free-solid-svg-icons";

export const SideBarIcon = (toggleSidebar) => [
  { icon: <FontAwesomeIcon icon={faBars} /> }, //0
  {
    icon: <FontAwesomeIcon className="close-btn-icon fs-3" icon={faXmark} onClick={toggleSidebar} />,
  }, //1
  { icon: <FontAwesomeIcon icon={faHeadset} /> }, //2
  { icon: <FontAwesomeIcon icon={faStar} /> }, //3
];

export const SideBarData = [
  {
    title: "Diary",
    icon: <FontAwesomeIcon icon={faBook} />,
    link: "/diary",
  },
  {
    title: "Likes",
    icon: <FontAwesomeIcon icon={faHeart} />,
    link: "/likes",
  },
  {
    title: "History",
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
    link: "/history",
  },
  {
    title: "Category",
    icon: <FontAwesomeIcon icon={faList} />,
    link: "/category",
  },
  {
    title: "Moody Match",
    icon: <FontAwesomeIcon icon={faStar} />,
    link: "/moody-match",
  },
];
