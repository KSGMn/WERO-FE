import React, { useContext, useEffect, useState } from "react";
import { useFeeds } from "../context/FeedContext";
import DesignGrid from "../components/DesignGrid/DesignGrid";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { categorySearchFeed, nonMemberCategorySearchFeed } from "../api";
import { AuthContext } from "../context/AuthContext";

const SearchComponent = () => {
  const { user } = useContext(AuthContext);
  const {
    loading,
    initialLoad,
    setHasMore,
    setIsFetching,
    setInitialLoad,
    toggleLike,
    loadMoreFeeds,
    page,
    setLoading,
  } = useFeeds();
  const [searchFeeds, setSearchFeeds] = useState([]);
  const { query } = useParams();
  const location = useLocation();

  console.log(query);

  useEffect(() => {
    if (location.pathname.includes("/category/search") && !initialLoad && user.user_id === "") {
      const nonMemberCategorySearchFeedResponse = (newFeeds) => {
        if (Array.isArray(newFeeds.data) && query) {
          setSearchFeeds([]);
          setSearchFeeds((prevFeeds) => [...prevFeeds, ...newFeeds.data]);
          setHasMore(newFeeds.data.length > 0);
          setIsFetching(false);
          setInitialLoad(true);
        } else {
          setHasMore(false);
        }
      };
      nonMemberCategorySearchFeed(query, page).then(nonMemberCategorySearchFeedResponse);
      setLoading(false);
    }

    if (location.pathname.includes("/category/search") && !initialLoad && user.user_id !== "") {
      const categorySearchFeedResponse = (newFeeds) => {
        if (Array.isArray(newFeeds.data) && query) {
          setSearchFeeds([]);
          setSearchFeeds((prevFeeds) => [...prevFeeds, ...newFeeds.data]);
          setHasMore(newFeeds.data.length > 0);
          setIsFetching(false);
          setInitialLoad(true);
        } else {
          setHasMore(false);
        }
      };
      categorySearchFeed(query, page).then(categorySearchFeedResponse);
      setLoading(false);
    }
  }, [query]);

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
