import amsterdam from "../../assets/card-background/amsterdam-1150319_1280.jpg";
import christmas from "../../assets/card-background/christmas-1911637_1280.jpg";
import love from "../../assets/card-background/love-3061483_1280.jpg";
import night from "../../assets/card-background/night-sky-7733876_1280.jpg";
import photography from "../../assets/card-background/photography-8486085_1280.jpg";
import piano from "../../assets/card-background/piano-8413277_1280.jpg";
import plouzane from "../../assets/card-background/plouzane-1758197_1280.jpg";
import seashells from "../../assets/card-background/seashells-1337565_1280.jpg";
import tree from "../../assets/card-background/tree-5019381_1280.jpg";

type ColorMap = {
  [key: string]: string;
};

type ImageMap = {
  [key: string]: string;
};

export const colorMap: ColorMap = {
  white: "#FFF",
  red: "#F00",
  blue: "#00F",
  green: "#0F0",
  yellow: "#FF0",
  orange: "#FFA500",
  purple: "#800080",
  pink: "#FFC0CB",
  gray: "#808080",
};

export const imageMap: ImageMap = {
  image1: amsterdam,
  image2: christmas,
  image3: love,
  image4: night,
  image5: photography,
  image6: piano,
  image7: plouzane,
  image8: seashells,
  image9: tree,
};

export const backgroundOptions = [...Object.keys(colorMap), ...Object.keys(imageMap)];

export const backgroundColorSelector = (background: string) => {
  return colorMap[background] || "white"; // 기본값을 "white"로 설정
};

export const backgroundImageSelector = (background: string) => {
  return imageMap[background] || null; // 기본값을 null로 설정
};
