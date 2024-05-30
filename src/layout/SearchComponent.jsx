import React, { useContext, useEffect, useState } from "react";
import { useFeeds } from "../context/FeedContext";
import DesignGrid from "../components/DesignGrid/DesignGrid";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { contentSearchFeed, nonMemberContentSearchFeed } from "../api";
import { AuthContext } from "../context/AuthContext";
import Cookies from "js-cookie";

const SearchComponent = () => {
  const { user, token } = useContext(AuthContext);
  const {
    loading,
    initialLoad,
    setHasMore,
    setIsFetching,
    setSearchContentInitialLoad,
    toggleLike,
    loadMoreFeeds,
    page,
    setLoading,
  } = useFeeds();
  const [searchFeeds, setSearchFeeds] = useState([]);
  const { query } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("search") && !initialLoad && user.user_id === "") {
      const nonMemberContentSearchFeedResponse = (newFeeds) => {
        if (Array.isArray(newFeeds.data) && query) {
          setSearchFeeds([]);
          setSearchFeeds((prevFeeds) => [...prevFeeds, ...newFeeds.data]);
          setHasMore(newFeeds.data.length > 0);
          setIsFetching(false);
          setSearchContentInitialLoad(true);
        } else {
          setHasMore(false);
        }
      };
      nonMemberContentSearchFeed(query, page).then(nonMemberContentSearchFeedResponse);
      setLoading(false);
    }
    if (token !== Cookies.get("accessToken") || Cookies.get("accessToken") === undefined) return;
    if (location.pathname.includes("search") && !initialLoad && user.user_id !== "") {
      const contentSearchFeedResponse = (newFeeds) => {
        if (Array.isArray(newFeeds.data) && query) {
          setSearchFeeds([]);
          setSearchFeeds((prevFeeds) => [...prevFeeds, ...newFeeds.data]);
          setHasMore(newFeeds.data.length > 0);
          setIsFetching(false);
          setSearchContentInitialLoad(true);
        } else {
          setHasMore(false);
        }
      };
      contentSearchFeed(query, page, token).then(contentSearchFeedResponse);
      setLoading(false);
    }
  }, [query, token]);

  if (loading) {
    return <div className="center-message">로딩 중...</div>;
  }

  let message = null;

  if (searchFeeds === undefined) {
    message = <div className="center-message">피드를 불러오지 못했습니다.</div>;
  } else if (searchFeeds.length === 0) {
    message = <div className="center-message">작성된 피드가 없습니다.</div>;
  }

  return (
    <div className="feed ">
      {message}
      {searchFeeds && searchFeeds.length > 0 && (
        <DesignGrid feeds={searchFeeds} toggleLike={toggleLike} loadMoreFeeds={loadMoreFeeds} />
      )}

      <Outlet />
    </div>
  );
};

export default SearchComponent;
