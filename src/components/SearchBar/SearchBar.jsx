import React, { useState } from "react";
import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 검색 실행 로직을 여기에 구현합니다.
    console.log("Searching for:", query);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <div className="search-bar d-flex flex-row">
          <input
            className="search-input"
            type="text"
            placeholder="검색"
            value={query}
            onChange={handleChange}
          />
          <button className="search-button" type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
