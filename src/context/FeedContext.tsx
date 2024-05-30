import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import {
  changeDiaryBookmark,
  feedAddLike,
  feedDeleteLike,
  findAllDiary,
  findAllFeed,
  findAllReport,
  findLikeFeed,
  findMyFeed,
  findSuspensionUsers,
  moodyMatchFeed,
  nonMemberFindAllFeed,
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
  userId: string;
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
  mainfeedUserId: string;
  reportContent: string;
  reportedTime: string;
}

interface SuspensionUsers {
  userId: string;
  email: string;
  restriction: boolean;
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
  searchContentFeeds: Feed[];
  setSearchContentFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  searchCategoryFeeds: Feed[];
  setSearchCategoryFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  diaries: Diary[];
  setDiaries: React.Dispatch<React.SetStateAction<Diary[]>>;
  reports: ReportFeed[];
  setReports: React.Dispatch<React.SetStateAction<ReportFeed[]>>;
  suspensionUsers: SuspensionUsers[];
  setSuspensionUsers: React.Dispatch<React.SetStateAction<SuspensionUsers[]>>;
  loading: Boolean;
  setLoading: (loading: boolean) => void;
  toggleLike: (arg: number, arg1: boolean) => {};
  toggleBookmark: (arg: string) => {};
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  loadMoreFeeds: () => void;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchContentInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchCategoryInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setReportsInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setSuspensionInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
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
export interface ApiSuspensionResponse {
  code: string;
  message: string;
  data: SuspensionUsers[];
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
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [MyFeeds, setMyFeeds] = useState<Feed[]>([]);
  const [MoodyMatchFeeds, setMoodyMatchFeeds] = useState<Feed[]>([]);
  const [LikeFeeds, setLikeFeeds] = useState<Feed[]>([]);
  const [searchContentFeeds, setSearchContentFeeds] = useState<Feed[]>([]);
  const [searchCategoryFeeds, setSearchCategoryFeeds] = useState<Feed[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [reports, setReports] = useState<ReportFeed[]>([]);
  const [suspensionUsers, setSuspensionUsers] = useState<SuspensionUsers[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [historyInitialLoad, setHistoryInitialLoad] = useState(false);
  const [likeInitialLoad, setlikeInitialLoad] = useState(false);
  const [searchContentInitialLoad, setSearchContentInitialLoad] = useState(false);
  const [searchCategoryInitialLoad, setSearchCategoryInitialLoad] = useState(false);
  const [reportsInitialLoad, setReportsInitialLoad] = useState(false);
  const [suspensionInitialLoad, setSuspensionInitialLoad] = useState(false);

  const { user, token, loading, setLoading } = useContext(AuthContext);

  const location = useLocation();

  useEffect(() => {
    if (token) return;
    if (location.pathname === "/" && !initialLoad) {
      const nonMemberFindAllFeedResponse = (newFeeds: ApiResponse) => {
        if (Array.isArray(newFeeds.data)) {
          setFeeds((prevFeeds) => [...prevFeeds, ...newFeeds.data]);
          setHasMore(newFeeds.data.length > 0);
          setIsFetching(false);
          setInitialLoad(true);
        } else {
          setHasMore(false);
        }
      };
      nonMemberFindAllFeed(page).then(nonMemberFindAllFeedResponse);
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (!token || Cookies.get("accessToken") === undefined) {
      return;
    }

    if (location.pathname.includes("suspension") && !suspensionInitialLoad) {
      const findSuspensionResponse = (newSuspesion: ApiSuspensionResponse) => {
        if (suspensionUsers.length !== 0) {
          setSuspensionUsers([]);
        }
        if (Array.isArray(newSuspesion.data)) {
          setSuspensionUsers((prevSuspension) => [...prevSuspension, ...newSuspesion.data]);
          setHasMore(newSuspesion.data.length > 0);
          setIsFetching(false);
          setSuspensionInitialLoad(true);
        } else {
          setHasMore(false);
        }
      };
      findSuspensionUsers(page).then(findSuspensionResponse);
      setLoading(false);
    }
    if (
      (location.pathname.includes("reports") && !reportsInitialLoad) ||
      (location.pathname === "/admin" && !reportsInitialLoad)
    ) {
      const findAllReportResponse = (newReports: ApiReportResponse) => {
        if (Array.isArray(newReports.data)) {
          setReports([]);
          setReports((prevReports) => [...prevReports, ...newReports.data]);
          setHasMore(newReports.data.length > 0);
          setIsFetching(false);
          setReportsInitialLoad(true);
        } else {
          setHasMore(false);
        }
      };
      findAllReport(page).then(findAllReportResponse);
      setLoading(false);
    }
    if (location.pathname === "/" && !initialLoad) {
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
      findAllFeed(page, token).then(findAllFeedResponse);
      setLoading(false);
    }
    if (token && user.user_id) {
      if (
        (location.pathname.includes("mypage") && !historyInitialLoad) ||
        (location.pathname === "/history" && !historyInitialLoad)
      ) {
        const findMyFeedResponse = (newMyFeeds: ApiResponse) => {
          if (newMyFeeds) {
            setMyFeeds((prevFeeds) => [...prevFeeds, ...newMyFeeds.data]);
            setHasMore(newMyFeeds.data.length > 0);
            setIsFetching(false);
            setHistoryInitialLoad(true);
          } else {
            setHasMore(false);
          }
        };
        if (token) {
          findMyFeed(page, token).then(findMyFeedResponse);
          setLoading(false);
        }
      }
      if (
        (location.pathname.includes("mypage") && !likeInitialLoad) ||
        (location.pathname === "/likes" && !likeInitialLoad)
      ) {
        const findLikeFeedResponse = (newLikeFeeds: ApiResponse) => {
          if (newLikeFeeds) {
            setLikeFeeds(newLikeFeeds.data);
            setIsFetching(false);
            setLoading(false);
            setlikeInitialLoad(true);
          }
        };
        findLikeFeed(token).then(findLikeFeedResponse);
      }
      if (location.pathname === "/moody-match") {
        const moodyMatchFeedResponse = (newMoodyMatchFeeds: ApiResponse) => {
          if (newMoodyMatchFeeds) {
            setMoodyMatchFeeds(newMoodyMatchFeeds.data);
            setIsFetching(false);
          }
        };
        moodyMatchFeed(user.user_id, token).then(moodyMatchFeedResponse);
        setLoading(false);
      }
      if (location.pathname === "/diary") {
        const findAllDiaryResponse = (newDiaries: ApiDiaryResponse) => {
          if (newDiaries) {
            setDiaries(newDiaries.list);
            setIsFetching(false);
          }
        };
        findAllDiary(token).then(findAllDiaryResponse);
        setLoading(false);
      }
    } else {
      location.pathname === "/login" ? setLoading(false) : setLoading(true);
    }
  }, [location, page, token]);

  const toggleLike = async (mainfeed_id: number, isLiked: boolean) => {
    if (!feeds || !MyFeeds || !LikeFeeds) return;

    const feed = feeds.find((f) => f.mainfeed_id === mainfeed_id);
    const myFeed = MyFeeds.find((f) => f.mainfeed_id === mainfeed_id);
    const likeFeed = LikeFeeds.find((f) => f.mainfeed_id === mainfeed_id);

    if (!feed && !myFeed && !likeFeed && !mainfeed_id) return;

    const response = (await (!isLiked ? feedAddLike(mainfeed_id) : feedDeleteLike(mainfeed_id))) as LikeResponse;

    if (response.code !== "CA" && response.code !== "SU") {
      console.error("Failed to toggle like");
    }
  };

  const toggleBookmark = async (diaryId: string) => {
    if (!diaries) return;

    const response = (await changeDiaryBookmark(diaryId)) as DefaultResponse;

    if (response.code !== "SU") {
      console.error("Failed to toggle bookmark");
    }
  };

  const loadMoreFeeds = () => {
    if (!loading && hasMore && !isFetching) {
      setIsFetching(true); // 추가 로드 시작
      setPage((prevPage) => {
        setInitialLoad(false);
        setHistoryInitialLoad(false);
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
        setInitialLoad,
        setIsFetching,
        suspensionUsers,
        setSuspensionUsers,
        searchCategoryFeeds,
        setSearchCategoryFeeds,
        searchContentFeeds,
        setSearchContentFeeds,
        setHasMore,
        setSearchContentInitialLoad,
        setSearchCategoryInitialLoad,
        setReportsInitialLoad,
        setSuspensionInitialLoad,
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
