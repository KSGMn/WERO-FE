import React, { createContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from "react";
import { Logout, deleteUserProfile, getUserImages, getUserProfile, updateUserProfile } from "../api";
import Cookies from "js-cookie";
import axios from "axios";
import UpdateUserRequestDto from "../api/request/user/update-user.request.dto";
import { useLocation, useNavigate } from "react-router-dom";

interface User {
  email: string;
  user_id: string;
  userName: string;
  passWord: string;
  profile_image?: string;
  bio?: string;
  platform_type?: string;
  gender: string;
}

interface getUser {
  userId: string;
  email: string;
  nickName: string;
  type: string;
  profile_image?: string;
  gender: string;
  password: string;
}

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  getUser: getUser | undefined;
  setGetUser: (getuser: getUser) => void;
  isLoggedIn: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
  token: string | undefined;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<boolean>;
  unlink_res: () => Promise<boolean>;
  deleteUser: (id: DeleteUserRequestDto) => Promise<boolean>;
  userImages: string[];
  setUserImages: (userImages: []) => void;
}

export interface ApiUserResponse {
  code: string;
  message: string;
  data: getUser;
}

// null 대신 적절한 초기값 제공
const initialAuthState: AuthContextType = {
  user: {
    email: "",
    user_id: "",
    userName: "",
    passWord: "",
    profile_image: "",
    bio: "",
    platform_type: "",
    gender: "",
  },
  setUser: () => {},
  getUser: { email: "", userId: "", nickName: "", type: "", profile_image: "", gender: "", password: "" },
  setGetUser: () => {},
  isLoggedIn: false,
  setLoggedIn: () => {},
  token: "",
  setToken: () => {},
  loading: false,
  setLoading: () => {},
  logout: async () => {
    try {
      return true;
    } catch {
      return false;
    }
  },
  unlink_res: async () => {
    try {
      return true;
    } catch {
      return false;
    }
  },
  deleteUser: async () => {
    try {
      return true;
    } catch {
      return false;
    }
  },
  userImages: [],
  setUserImages: () => {},
};

interface AuthProviderProps {
  children: ReactNode;
}

interface DeleteUserRequestDto {
  userId: string;
}

export const AuthContext = createContext<AuthContextType>(initialAuthState);

//export const useUser = () => useContext(AuthContext);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState(Cookies.get("accessToken"));
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [getUser, setGetUser] = useState<getUser | undefined>(undefined);

  const [user, setUser] = useState<User>({
    email: getUser?.email || "",
    user_id: getUser?.userId || "",
    userName: getUser?.nickName || "",
    passWord: "",
    profile_image: "",
    bio: "오늘..",
    platform_type: "",
    gender: "",
  });

  const [userImages, setUserImages] = useState([]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const token = Cookies.get("accessToken");

      if (isLoggedIn && token) {
        setLoggedIn(true);
        setToken(token);
        console.log("로그인 상태 및 토큰 설정됨");
      } else {
        console.log("로그인 상태가 아니거나 토큰이 없음");
      }
    };

    checkLoginStatus();

    // 로그인 상태나 토큰이 변경될 때마다 확인
    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    if (token) {
      setLoading(true);
      console.log(Cookies.get("accessToken"));
      const getUserResponse = (user: ApiUserResponse) => {
        if (user.code === "SU") {
          setGetUser(user.data);
        }
      };
      getUserProfile(token).then(getUserResponse);

      const getUserImagesResponse = (images: []) => {
        if (images) {
          setUserImages(images);
        }
      };
      getUserImages(token).then(getUserImagesResponse);
    }
  }, [token, loading]);

  //getUser가 업데이트될 때 user 상태를 설정
  useEffect(() => {
    if (getUser) {
      const encodedFileName = userImages[0];
      const decodedFileName = decodeURIComponent(encodedFileName);
      const imageUrl = `http://localhost:8080/uploads/${decodedFileName}`;
      setUser({
        email: getUser.email,
        user_id: getUser.userId,
        userName: getUser.nickName,
        passWord: getUser.password,
        profile_image: imageUrl,
        bio: "오늘..",
        platform_type: getUser.type,
        gender: getUser.gender,
      });
      setLoading(false);
    }
  }, [getUser, userImages, loading]);

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

  const userIdNumber = user.user_id.replace("kakao_", "");

  const KAKAO_UNLINK_URI = "https://kapi.kakao.com/v1/user/unlink";
  const adKey = "23ee5400bccab2975c39e6a37dfb80aa";

  const unlink_res = async () => {
    try {
      const response = await axios.post(
        KAKAO_UNLINK_URI,
        {
          target_id_type: "user_id",
          target_id: userIdNumber, //  해당 사용자 id(카카오 회원번호)
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `KakaoAK ${adKey}`,
          },
        }
      );

      console.log(response.data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching Kakao user data:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
      return false;
    }
  };

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

  const deleteUser = async (id: DeleteUserRequestDto): Promise<boolean> => {
    try {
      await deleteUserProfile(id);
      localStorage.removeItem("isLoggedIn"); // 로컬 스토리지에서 인증 상태 제거
      localStorage.removeItem("user_id"); // 로컬 스토리지에서 인증 상태 제거

      // 쿠키 삭제
      Cookies.remove("accessToken", { path: "/" }); // 액세스 토큰 삭제
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        getUser,
        setGetUser,
        isLoggedIn,
        setLoggedIn,
        loading,
        setLoading,
        logout,
        unlink_res,
        deleteUser,
        userImages,
        setUserImages,
        token,
        setToken,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}
