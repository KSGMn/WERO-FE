import { createContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from "react";
import { Logout, deleteUserProfile, getRefreshToken, getUserImages, getUserProfile } from "../api";
import Cookies from "js-cookie";
import axios from "axios";
import { ResponseBody } from "../types";
import RefreshTokenResponseDto from "../api/response/auth/refresh-token.response.dto";
import { ResponseCode } from "../types/enums";
import { useLocation, useNavigate } from "react-router-dom";
import RefreshTokenRequestDto from "../api/request/auth/refresh-token.request.dto";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

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
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  refreshToken: string | null;
  setRefreshToken: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<boolean>;
  unlink_res: () => Promise<boolean>;
  deleteUser: (id: DeleteUserRequestDto) => Promise<boolean>;
  userImages: string[];
  setUserImages: (userImages: []) => void;
  authNavigate: (path: string) => void;
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
  refreshToken: "",
  setRefreshToken: () => {},
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
  authNavigate: () => {},
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
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken", "refreshToken"]);
  const [token, setToken] = useState<string | null>(cookies.accessToken || null);
  const [refreshToken, setRefreshToken] = useState<string | null>(cookies.refreshToken || null);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [getUser, setGetUser] = useState<getUser | undefined>(undefined);

  const [user, setUser] = useState<User>({
    email: "",
    user_id: "",
    userName: "",
    passWord: "",
    profile_image: "",
    bio: "오늘..",
    platform_type: "",
    gender: "",
  });

  const [userImages, setUserImages] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const isTokenExpired = (token: string) => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  const refreshResponse = (responseBody: ResponseBody<RefreshTokenResponseDto>) => {
    if (!responseBody) return;

    const { code } = responseBody;

    if (code === "SU") {
      const { token: newAccessToken } = responseBody as RefreshTokenResponseDto;

      const now = new Date().getTime();
      const expires = new Date(now + 3600 * 1000);
      Cookies.set("accessToken", newAccessToken, { expires, path: "/" });

      setToken(newAccessToken);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (isTokenExpired(cookies.accessToken) === true && refreshToken) {
      const requestBody = { refreshToken };
      getRefreshToken(requestBody).then(refreshResponse);
    }
    if (isTokenExpired(cookies.refreshToken) === true && user.user_id !== "" && isLoggedIn) {
      alert("세션이 만료되었습니다");
      logout();
      navigate("/");
    }
  }, []);

  const authNavigate = async (path: string) => {
    if (isTokenExpired(cookies.accessToken) === true && refreshToken) {
      const requestBody = { refreshToken };
      await getRefreshToken(requestBody).then(refreshResponse);
    }
    navigate(path);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (isTokenExpired(cookies.refreshToken) === true && user.user_id !== "" && isLoggedIn) {
        alert("세션이 만료되었습니다");
        logout();
        navigate("/");
      }
      if (isLoggedIn && token) {
        setLoggedIn(true);
      } else {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [cookies.refreshToken]);

  useEffect(() => {
    if (token) {
      const getUserResponse = (user: ApiUserResponse) => {
        if (user) {
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
  }, [loading]);

  //getUser가 업데이트될 때 user 상태를 설정
  useEffect(() => {
    if (getUser && isLoggedIn) {
      const encodedFileName = userImages[userImages.length - 1];
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
  }, [getUser, userImages]);

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
      const emptyUser = Object.keys(user).reduce((acc: any, key: any) => {
        acc[key] = "";
        return acc;
      }, {});
      setUser(emptyUser);

      // 쿠키 삭제
      Cookies.remove("accessToken", { path: "/" }); // 액세스 토큰 삭제
      Cookies.remove("refreshToken", { path: "/" }); // 리프레시 토큰 삭제

      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteUser = async (id: DeleteUserRequestDto): Promise<boolean> => {
    try {
      await deleteUserProfile(id);
      logout();
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
        refreshToken,
        setRefreshToken,
        authNavigate,
      }}
    >
      {loading ? <div></div> : children}
    </AuthContext.Provider>
  );
}
