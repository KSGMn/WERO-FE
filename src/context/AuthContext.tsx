import React, { createContext, useState, ReactNode } from "react";
import { Logout } from "../api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface User {
  user_id: string;
  // 선택적으로 추가 필드를 여기에 정의할 수 있습니다.
  userName?: string;
  passWord?: string;
  profile_image?: string;
  bio?: string;
  platform_type?: string;
}

interface DiaryEntry {
  diary_id: string;
  user_id: string;
  isBookmarked: boolean;
  isLiked: boolean;
  content: string;
  trackName: string;
}

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  diary: DiaryEntry[];
  setDiary: (diary: DiaryEntry[]) => void;
  isLoggedIn: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<boolean>;
}

// null 대신 적절한 초기값 제공
const initialAuthState: AuthContextType = {
  user: { user_id: "", userName: "", passWord: "", profile_image: "", bio: "", platform_type: "" },
  setUser: () => {},
  diary: [],
  setDiary: () => {},
  isLoggedIn: false,
  setLoggedIn: () => {},
  loading: true,
  setLoading: () => {},
  logout: async () => {
    try {
      return true;
    } catch {
      return false;
    }
  },
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>(initialAuthState);

//export const useUser = () => useContext(AuthContext);

export default function AuthProvider({ children }: AuthProviderProps) {
  const userId = localStorage.getItem("user_id");

  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [user, setUser] = useState<User>({
    user_id: userId ? userId : "",
    userName: "홍길동",
    passWord: "",
    profile_image: "",
    bio: "오늘..",
    platform_type: "",
  });

  const [diary, setDiary] = useState<DiaryEntry[]>([
    {
      diary_id: "1",
      user_id: "test",
      isBookmarked: false,
      isLiked: true,
      content: "첫 일기",
      trackName: "김광석 - 이등병의 편지",
    },
    {
      diary_id: "2",
      user_id: "test",
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

  const logout = async (): Promise<boolean> => {
    try {
      await Logout();
      localStorage.removeItem("isLoggedIn"); // 로컬 스토리지에서 인증 상태 제거
      localStorage.removeItem("user_id"); // 로컬 스토리지에서 인증 상태 제거

      setLoggedIn(false);
      setUser({ ...user, user_id: "" });

      // 쿠키 삭제
      Cookies.remove("accessToken", { path: "/" }); // 액세스 토큰 삭제
      //Cookies.remove("refreshToken", { path: "/" }); // 리프레시 토큰 삭제

      return true;
    } catch (error) {
      console.log("로그아웃 에러: ", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, diary, setDiary, isLoggedIn, setLoggedIn, loading, setLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
