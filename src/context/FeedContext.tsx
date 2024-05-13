import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { feedAddLike, feedDeleteLike, findAllFeed, findLikeFeed, findMyFeed, moodyMatchFeed } from "../api";
import { AuthContext } from "./AuthContext";
import { useLocation } from "react-router-dom";

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

type FeedContextType = {
  feeds: Feed[];
  setFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  MyFeeds: Feed[];
  setMyFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  MoodyMatchFeeds: Feed[];
  setMoodyMatchFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  LikeFeeds: Feed[];
  setLikeFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  loading: Boolean;
  setLoading: (arg: Boolean) => void;
  toggleLike: (arg: number, arg1: boolean) => {};
};

interface FeedProviderProps {
  children: ReactNode;
}

interface ApiResponse {
  code: string;
  message: string;
}

export const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider = ({ children }: FeedProviderProps) => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [MyFeeds, setMyFeeds] = useState<Feed[]>([]);
  const [MoodyMatchFeeds, setMoodyMatchFeeds] = useState<Feed[]>([]);
  const [LikeFeeds, setLikeFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  const { user } = useContext(AuthContext);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      const findAllFeedResponse = (newFeeds: any) => {
        if (newFeeds) {
          setFeeds(newFeeds);
          setLoading(false);
        }
      };
      findAllFeed(user.user_id).then(findAllFeedResponse);
    }
    if (location.pathname === "/mypage" || location.pathname === "/history") {
      const findMyFeedResponse = (newMyFeeds: any) => {
        if (newMyFeeds) {
          setMyFeeds(newMyFeeds);
          setLoading(false);
        }
      };
      findMyFeed(user.user_id).then(findMyFeedResponse);
    }
    if (location.pathname === "/mypage" || location.pathname === "/likes") {
      const findLikeFeedResponse = (newLikeFeeds: any) => {
        if (newLikeFeeds) {
          setLikeFeeds(newLikeFeeds);
          setLoading(false);
        }
      };
      findLikeFeed(user.user_id).then(findLikeFeedResponse);
    }
    if (location.pathname === "/moody-match") {
      const moodyMatchFeedResponse = (newMoodyMatchFeeds: any) => {
        if (newMoodyMatchFeeds) {
          setMoodyMatchFeeds(newMoodyMatchFeeds);
          setLoading(false);
        }
      };
      moodyMatchFeed(user.user_id).then(moodyMatchFeedResponse);
    }
  }, [location.pathname]);

  const toggleLike = async (mainfeed_id: number, isLiked: boolean) => {
    const feed = feeds.find((f) => f.mainfeed_id === mainfeed_id);
    const myFeed = MyFeeds.find((f) => f.mainfeed_id === mainfeed_id);
    const likeFeed = LikeFeeds.find((f) => f.mainfeed_id === mainfeed_id);

    if (!feed && !myFeed && !likeFeed && !mainfeed_id) return;

    const response = (await (!isLiked
      ? feedAddLike(user.user_id, mainfeed_id)
      : feedDeleteLike(user.user_id, mainfeed_id))) as ApiResponse;

    if (response.code !== "SU") {
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
