import React, { createContext, useState, ReactNode, useEffect, useMemo } from "react";
import { Logout, getUserProfile } from "../api";
import Cookies from "js-cookie";
import axios from "axios";
import { faL } from "@fortawesome/free-solid-svg-icons";

interface User {
  email: string;
  user_id: string;
  userName: string;
  passWord: string;
  profile_image?: string;
  bio?: string;
  platform_type?: string;
}

interface getUser {
  userId: string;
  email: string;
  nickName: string;
  platform_type?: string;
  profile_image?: string;
}

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  getUser: getUser | undefined;
  setGetUser: (getuser: getUser) => void;
  isLoggedIn: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<boolean>;
}

export interface ApiUserResponse {
  code: string;
  message: string;
  data: getUser;
}

export interface ApiUpdateUserResponse {}

// null 대신 적절한 초기값 제공
const initialAuthState: AuthContextType = {
  user: { email: "", user_id: "", userName: "", passWord: "", profile_image: "", bio: "", platform_type: "" },
  setUser: () => {},
  getUser: { email: "", userId: "", nickName: "", platform_type: "", profile_image: "" },
  setGetUser: () => {},
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

  const [token, setToken] = useState(Cookies.get("accessToken"));
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [getUser, setGetUser] = useState<getUser | undefined>(undefined);

  const [user, setUser] = useState<User>({
    email: "",
    user_id: getUser?.userId || "",
    userName: "",
    passWord: "",
    profile_image: "https://ondostudio.co.kr/wp-content/uploads/2019/12/01-3-7-683x1024.jpg",
    bio: "오늘..",
    platform_type: "kakao",
  });

  useEffect(() => {
    console.log("유저 데이터 조회 토큰" + token);
    if (!token) {
      setLoading(true);
      return;
    }
    if (token) {
      const getUserResponse = (user: ApiUserResponse) => {
        if (user) {
          console.log("유저다" + user);
          setGetUser(user.data);
        }
      };
      getUserProfile().then(getUserResponse);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const isLoggenIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggenIn) {
      setLoggedIn(true);
    }
    if (!token && isLoggedIn) {
      console.log("왜안됨?");
      window.location.reload();
      setToken(Cookies.get("accessToken"));
    }
  }, [isLoggedIn]);

  //getUser가 업데이트될 때 user 상태를 설정
  useEffect(() => {
    console.log("데이터 삽입");
    if (getUser) {
      setUser({
        email: getUser.email,
        user_id: getUser.userId,
        userName: getUser.nickName,
        passWord: "",
        profile_image: "https://ondostudio.co.kr/wp-content/uploads/2019/12/01-3-7-683x1024.jpg",
        bio: "오늘..",
        platform_type: "kakao",
      });
    }
  }, [getUser]);

  // console.log(token);
  // const getKaKaoUserData = async (token: any) => {
  //   try {
  //     const response = await axios.post(
  //       "https://kapi.kakao.com/v1/user/unlink",
  //       {},
  //       {
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log(response.data);
  //     return response.data;
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error("Error fetching Kakao user data:", error.response?.data);
  //     } else {
  //       console.error("Unexpected error:", error);
  //     }
  //     throw error;
  //   }
  // };

  // getKaKaoUserData(token);

  // const KAKAO_UNLINK_URI = "https://kapi.kakao.com/v1/user/unlink";
  // const adKey = "23ee5400bccab2975c39e6a37dfb80aa";

  // const unlink_res = async () => {
  //   try {
  //     const response = await axios.post(
  //       KAKAO_UNLINK_URI,
  //       {
  //         target_id_type: "user_id",
  //         target_id: 3484569269, //  해당 사용자 id(카카오 회원번호)
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //           Authorization: `KakaoAK ${adKey}`,
  //         },
  //       }
  //     );

  //     console.log(response.data);
  //     return console.log("회원탈퇴");
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error("Error fetching Kakao user data:", error.response?.data);
  //     } else {
  //       console.error("Unexpected error:", error);
  //     }
  //     throw error;
  //   }
  // };

  // unlink_res();

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
    <AuthContext.Provider
      value={{ user, setUser, getUser, setGetUser, isLoggedIn, setLoggedIn, loading, setLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
