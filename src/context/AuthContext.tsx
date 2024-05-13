import React, { createContext, useState, ReactNode, useEffect } from "react";
import { Logout } from "../api";
import Cookies from "js-cookie";

interface User {
  email: string;
  user_id: string;
  userName: string;
  passWord: string;
  profile_image?: string;
  bio?: string;
  platform_type?: string;
}

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  isLoggedIn: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<boolean>;
}

// null 대신 적절한 초기값 제공
const initialAuthState: AuthContextType = {
  user: { email: "", user_id: "", userName: "", passWord: "", profile_image: "", bio: "", platform_type: "" },
  setUser: () => {},
  isLoggedIn: false,
  setLoggedIn: () => {},
  loading: false,
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
  const [loading, setLoading] = useState<boolean>(false);

  const [user, setUser] = useState<User>({
    email: "이메일",
    user_id: userId ? userId : "",
    userName: "홍길동",
    passWord: "",
    profile_image: "https://ondostudio.co.kr/wp-content/uploads/2019/12/01-3-7-683x1024.jpg",
    bio: "오늘..",
    platform_type: "kakao",
  });

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setLoggedIn(true);
    }
  }, [userId]);

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
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setLoggedIn, loading, setLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
