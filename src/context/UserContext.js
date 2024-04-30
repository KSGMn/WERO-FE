import React, { createContext, useContext, useState } from "react";

// Context생성
export const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

export default function UserProvider({ children }) {
  const [user, setUser] = useState({
    // User: {
    //   user_id: "1",
    //   userName: "홍길동",
    //   passWord: "12345",
    //   profile_image: "",
    //   bio: "오늘 너무 슬퍼요....",
    //   platform_type: "NAVER",
    // },
  });

  const [diary, setDiary] = useState([
    {
      diary_id: "1",
      user_id: "1",
      isBookmarked: false,
      isLiked: true,
      content: "첫 일기",
      trackName: "김광석 - 이등병의 편지",
    },
    {
      diary_id: "2",
      user_id: "1",
      isBookmarked: true,
      isLiked: false,
      content: "두 번째 일기",
      trackName: "김광석 - 일병의 편지",
    },
    {
      diary_id: "3",
      user_id: "1",
      isBookmarked: false,
      isLiked: false,
      content: "세 번째 일기",
      trackName: "김광석 - 상병의 편지",
    },
    {
      diary_id: "4",
      user_id: "2",
      isBookmarked: true,
      isLiked: false,
      content: "세 번째 일기",
      trackName: "투투 - 일과 이분의 일",
    },
    {
      diary_id: "5",
      user_id: "2",
      isBookmarked: false,
      isLiked: true,
      content: "세 번째 일기",
      trackName: "투투 - 이와 이분의 일",
    },
    {
      diary_id: "6",
      user_id: "3",
      isBookmarked: true,
      isLiked: true,
      content: "세 번째 일기",
      trackName: "투투 - 삼과 이분의 일",
    },
  ]);

  return (
    <UserContext.Provider value={{ user, setUser, diary, setDiary }}>
      {children}
    </UserContext.Provider>
  );
}
