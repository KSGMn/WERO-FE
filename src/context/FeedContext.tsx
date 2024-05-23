import React, { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  changeDiaryBookmark,
  feedAddLike,
  feedDeleteLike,
  findAllDiary,
  findAllFeed,
  findAllReport,
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
  diaryId: string;
  diaryContent: string;
  emotion: string;
  song: string;
  userId: string;
  isBookmarked: number;
  image: string;
}

interface ReportFeed {
  reportId: number;
  mainfeedId: number;
  reportContent: string;
  reportedTime: string;
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
  reports: ReportFeed[];
  setReports: React.Dispatch<React.SetStateAction<ReportFeed[]>>;
  loading: Boolean;
  setLoading: (arg: Boolean) => void;
  toggleLike: (arg: number, arg1: boolean) => {};
  toggleBookmark: (arg: string) => {};
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  loadMoreFeeds: () => void;
};

interface FeedProviderProps {
  children: ReactNode;
}

export interface ApiResponse {
  code: string;
  message: string;
  data: Feed[];
}

export interface ApiReportResponse {
  code: string;
  message: string;
  data: ReportFeed[];
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

export interface ApiOneDiaryResponse {
  code: string;
  message: string;
  diaryId: string;
  diaryContent: string;
  emotion: string;
  song: string;
  userId: string;
  isBookmarked: string;
  image: string;
}

export interface DefaultResponse {
  code: string;
  message: string;
}

interface LikeResponse {
  code: string;
  message: string;
}

export const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider = ({ children }: FeedProviderProps) => {
  const [token, setToken] = useState(Cookies.get("accessToken"));
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [MyFeeds, setMyFeeds] = useState<Feed[]>([]);
  const [MoodyMatchFeeds, setMoodyMatchFeeds] = useState<Feed[]>([]);
  const [LikeFeeds, setLikeFeeds] = useState<Feed[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [reports, setReports] = useState<ReportFeed[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  const { user } = useContext(AuthContext);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin" && !initialLoad) {
      const findAllReportResponse = (newReports: ApiReportResponse) => {
        if (Array.isArray(newReports.data)) {
          setReports((prevReports) => [...prevReports, ...newReports.data]);
          setHasMore(newReports.data.length > 0);
          setIsFetching(false);
          setInitialLoad(true);
        } else {
          setHasMore(false);
        }
      };
      findAllReport(page).then(findAllReportResponse);
      setLoading(false);
    }
    if (location.pathname === "/" && !initialLoad) {
      console.log(user);
      const findAllFeedResponse = (newFeeds: ApiResponse) => {
        if (Array.isArray(newFeeds.data)) {
          setFeeds((prevFeeds) => [...prevFeeds, ...newFeeds.data]);
          setHasMore(newFeeds.data.length > 0);
          setIsFetching(false);
          setInitialLoad(true);
        } else {
          setHasMore(false);
        }
      };
      findAllFeed(user.user_id, page).then(findAllFeedResponse);
      setLoading(false);
    }
    if (token && user.user_id) {
      if (location.pathname === "/mypage" || location.pathname === "/history") {
        const findMyFeedResponse = (newMyFeeds: ApiResponse) => {
          if (newMyFeeds) {
            setMyFeeds((prevFeeds) => [...prevFeeds, ...newMyFeeds.data]);

            setHasMore(newMyFeeds.data.length > 0);
            setIsFetching(false);
            setLoading(false);
          }
        };
        findMyFeed(user.user_id, page).then(findMyFeedResponse);
      }
      if (location.pathname === "/mypage" || location.pathname === "/likes") {
        const findLikeFeedResponse = (newLikeFeeds: ApiResponse) => {
          if (newLikeFeeds) {
            setLikeFeeds(newLikeFeeds.data);
            setIsFetching(false);
            setLoading(false);
          }
        };
        findLikeFeed(user.user_id).then(findLikeFeedResponse);
      }
      if (location.pathname === "/moody-match") {
        const moodyMatchFeedResponse = (newMoodyMatchFeeds: ApiResponse) => {
          if (newMoodyMatchFeeds) {
            setMoodyMatchFeeds(newMoodyMatchFeeds.data);
            setIsFetching(false);
            setLoading(false);
          }
        };
        moodyMatchFeed(user.user_id).then(moodyMatchFeedResponse);
      }
      if (location.pathname === "/diary") {
        const findAllDiaryResponse = (newDiaries: ApiDiaryResponse) => {
          if (newDiaries) {
            setDiaries(newDiaries.list);
            setIsFetching(false);
            setLoading(false);
          }
        };
        findAllDiary().then(findAllDiaryResponse);
      }
    } else {
      setLoading(true);
    }
  }, [location, user.user_id, page]);

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

  const toggleBookmark = async (diaryId: string) => {
    if (!diaries) return;

    const response = (await changeDiaryBookmark(diaryId)) as DefaultResponse;
    console.log(response);

    if (response.code !== "SU") {
      console.error("Failed to toggle bookmark");
    }
  };

  const loadMoreFeeds = () => {
    if (!loading && hasMore && !isFetching) {
      setIsFetching(true); // 추가 로드 시작
      setPage((prevPage) => {
        setInitialLoad(false);
        const newPage = prevPage + 1;
        return newPage;
      });
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
        toggleBookmark,
        page,
        setPage,
        loadMoreFeeds,
        reports,
        setReports,
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
