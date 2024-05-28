import React, { useState } from "react";
import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useFeeds } from "../../context/FeedContext";

const SearchBar = () => {
  const { setInitialLoad, setIsFetching } = useFeeds();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    setIsFetching(true);
    setInitialLoad(false);
    e.preventDefault();
    navigate(`/search/${query}`);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <div className="search-bar d-flex flex-row">
          <input className="search-input" type="text" placeholder="검색" value={query} onChange={handleChange} />
          <button className="search-button" type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
