import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import {
  feedAddLike,
  feedDeleteLike,
  findAllDiary,
  findAllFeed,
  findLikeFeed,
  findMyFeed,
  moodyMatchFeed,
} from "../api";
import { AuthContext } from "./AuthContext";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

interface Feed {
  mainfeed_id: number;
  content: string;
  trackName: string;
  image: string;
  create_date: string;
  modificate_date: string | null;
  category: string;
  liked: boolean;
}

interface Diary {
  diaryId: number;
  diaryContent: string;
  emotion: string;
  song: string;
}

type FeedContextType = {
  feeds: Feed[];
  setFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  MyFeeds: Feed[];
  setMyFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  MoodyMatchFeeds: Feed[];
  setMoodyMatchFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  LikeFeeds: Feed[];
  setLikeFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  diaries: Diary[];
  setDiaries: React.Dispatch<React.SetStateAction<Diary[]>>;
  loading: Boolean;
  setLoading: (arg: Boolean) => void;
  toggleLike: (arg: number, arg1: boolean) => {};
};

interface FeedProviderProps {
  children: ReactNode;
}

export interface ApiResponse {
  code: string;
  message: string;
  data: Feed[];
}

export interface ApiOneResponse {
  code: string;
  message: string;
  data: Feed;
}

export interface ApiDiaryResponse {
  code: string;
  message: string;
  list: Diary[];
}

interface LikeResponse {
  code: string;
  message: string;
}

export const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider = ({ children }: FeedProviderProps) => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [MyFeeds, setMyFeeds] = useState<Feed[]>([]);
  const [MoodyMatchFeeds, setMoodyMatchFeeds] = useState<Feed[]>([]);
  const [LikeFeeds, setLikeFeeds] = useState<Feed[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  const { user } = useContext(AuthContext);

  const location = useLocation();

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    if (accessToken) {
      if (location.pathname === "/") {
        const findAllFeedResponse = (newFeeds: ApiResponse) => {
          if (newFeeds) {
            setFeeds(newFeeds.data);
            setLoading(false);
          }
        };
        findAllFeed(user.user_id).then(findAllFeedResponse);
      }
      if (location.pathname === "/mypage" || location.pathname === "/history") {
        const findMyFeedResponse = (newMyFeeds: ApiResponse) => {
          if (newMyFeeds) {
            setMyFeeds(newMyFeeds.data);
            setLoading(false);
          }
        };
        findMyFeed(user.user_id).then(findMyFeedResponse);
      }
      if (location.pathname === "/mypage" || location.pathname === "/likes") {
        const findLikeFeedResponse = (newLikeFeeds: ApiResponse) => {
          if (newLikeFeeds) {
            setLikeFeeds(newLikeFeeds.data);
            setLoading(false);
          }
        };
        findLikeFeed(user.user_id).then(findLikeFeedResponse);
      }
      if (location.pathname === "/moody-match") {
        const moodyMatchFeedResponse = (newMoodyMatchFeeds: ApiResponse) => {
          if (newMoodyMatchFeeds) {
            setMoodyMatchFeeds(newMoodyMatchFeeds.data);
            setLoading(false);
          }
        };
        moodyMatchFeed(user.user_id).then(moodyMatchFeedResponse);
      }
      if (location.pathname === "/diary") {
        const findAllDiaryResponse = (newDiaries: ApiDiaryResponse) => {
          if (newDiaries) {
            setDiaries(newDiaries.list);
            setLoading(false);
          }
        };
        findAllDiary().then(findAllDiaryResponse);
      }
    } else {
      setLoading(true);
    }
  }, [location.pathname]);

  const toggleLike = async (mainfeed_id: number, isLiked: boolean) => {
    if (!feeds || !MyFeeds || !LikeFeeds) return;

    const feed = feeds.find((f) => f.mainfeed_id === mainfeed_id);
    const myFeed = MyFeeds.find((f) => f.mainfeed_id === mainfeed_id);
    const likeFeed = LikeFeeds.find((f) => f.mainfeed_id === mainfeed_id);

    if (!feed && !myFeed && !likeFeed && !mainfeed_id) return;

    const response = (await (!isLiked
      ? feedAddLike(user.user_id, mainfeed_id)
      : feedDeleteLike(user.user_id, mainfeed_id))) as LikeResponse;

    if (response.code !== "CA" && response.code !== "SU") {
      console.error("Failed to toggle like");
    }
  };

  return (
    <FeedContext.Provider
      value={{
        feeds,
        setFeeds,
        loading,
        setLoading,
        MyFeeds,
        setMyFeeds,
        MoodyMatchFeeds,
        setMoodyMatchFeeds,
        LikeFeeds,
        setLikeFeeds,
        diaries,
        setDiaries,
        toggleLike,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

// Context 사용을 위한 훅
export const useFeeds = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeeds must be used within a FeedProvider");
  }
  return context;
};

export default FeedProvider;
