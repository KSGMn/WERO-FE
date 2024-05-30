import axios, { AxiosResponse } from "axios";
import IdCheckRequestDto from "./request/auth/id-check.request.dto";
import { IdCheckResponseDto, SignInResponseDto } from "./response/auth";
import { ResponseDto } from "./response";
import {
  CheckCertificationRequestDto,
  EmailCertificationRequestDto,
  SignInRequestDto,
  SignUpRequestDto,
} from "./request/auth";
import CheckCertificationResponseDto from "./response/auth/check-certification.response.dto";
import EmailCertificationResponseDto from "./response/auth/email-certification.response.dto";
import SignupResponseDto from "./response/auth/sign-up.response.dto";
import Cookies from "js-cookie";
import {
  ApiDiaryResponse,
  ApiOneDiaryResponse,
  ApiOneResponse,
  ApiReportResponse,
  ApiResponse,
  ApiSuspensionResponse,
  DefaultResponse,
} from "../context/FeedContext";
import CreateFeedRequestDto from "./request/feed/create-feed.request.dto";
import UpdateFeedRequestDto from "./request/feed/update-feed.request.dto";
import { ApiUserResponse } from "../context/AuthContext";
import CreateDiaryRequestDto from "./request/diary/create-diary.request.dto";
import UpdateDiaryRequestDto from "./request/diary/update-diary.request.dto";
import UpdateUserRequestDto from "./request/user/update-user.request.dto";
import DeleteUserRequestDto from "./request/user/delete-user.request.dto";
import UserPostPictureRequestDto from "./request/user/user-post-picture.request.dto";
import RefreshTokenRequestDto from "./request/auth/refresh-token.request.dto";
import RefreshTokenResponseDto from "./response/auth/refresh-token.response.dto";

const responseHandler = <T>(response: AxiosResponse<any, any>) => {
  const responseBody: T = response.data;
  return responseBody;
};

const errorHandler = (error: any) => {
  if (!error.response || !error.response.data) return null;
  const responseBody: ResponseDto = error.response.data;
  return responseBody;
};


//const DOMAIN = "http://localhost:8080";
const DOMAIN = process.env.REACT_APP_API_DOMAIN;
const API_DOMAIN = `${DOMAIN}/api/v1`;

//auth api

export const SNS_SIGN_IN_URL = (type: "kakao" | "naver") => `${API_DOMAIN}/auth/oauth2/${type}`;
const LOG_OUT = () => `${API_DOMAIN}/auth/logout`;
const SING_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/register`;
const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;
const DELETE_USER_URL = () => `${API_DOMAIN}/user/delete`;
const REFRESH_TOKEN_URL = () => `${API_DOMAIN}/auth/refresh`;

export const signInRequest = async (requestBody: SignInRequestDto) => {
  const result = await axios
    .post(SING_IN_URL(), requestBody)
    .then(responseHandler<SignInResponseDto>)
    .catch(errorHandler);
  return result;
};

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const result = await axios
    .post(SIGN_UP_URL(), requestBody)
    .then(responseHandler<SignupResponseDto>)
    .catch(errorHandler);
  return result;
};

export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
  const result = await axios
    .post(ID_CHECK_URL(), requestBody)
    .then(responseHandler<IdCheckResponseDto>)
    .catch(errorHandler);
  return result;
};

export const emailCertificationRequest = async (requestBody: EmailCertificationRequestDto) => {
  const result = await axios
    .post(EMAIL_CERTIFICATION_URL(), requestBody)
    .then(responseHandler<EmailCertificationResponseDto>)
    .catch(errorHandler);
  return result;
};

export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto) => {
  const result = await axios
    .post(CHECK_CERTIFICATION_URL(), requestBody)
    .then(responseHandler<CheckCertificationResponseDto>)
    .catch(errorHandler);
  return result;
};

export const Logout = () => axios.post(LOG_OUT());

export const deleteUserProfile = async (requestBody: DeleteUserRequestDto) => {
  const result = await axios
    .delete(DELETE_USER_URL(), {
      headers: headers,
      withCredentials: true,
      data: requestBody,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as DefaultResponse;
};

export const getRefreshToken = async (requestBody: RefreshTokenRequestDto) => {
  const result = await axios
    .post(REFRESH_TOKEN_URL(), requestBody)
    .then(responseHandler<RefreshTokenResponseDto>)
    .catch(errorHandler);
  return result;
};

//user profile api

const GET_USER_URL = () => `${API_DOMAIN}/user/profile`;
const UPDATE_USER_URL = () => `${API_DOMAIN}/user/update`;
const GET_USER_IMAGES_URL = () => `${API_DOMAIN}/user/find/prof`;
const UPLOAD_USER_IMAGES_URL = () => `${API_DOMAIN}/user/update/prof`;

export const getUserProfile = async (token: string) => {
  const result = await axios
    .get(GET_USER_URL(), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiUserResponse;
};

export const updateUserProfile = async (requestBody: UpdateUserRequestDto) => {
  const result = await axios
    .patch(UPDATE_USER_URL(), requestBody, {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as DefaultResponse;
};

export const getUserImages = async (token: string) => {
  const result = await axios
    .get(GET_USER_IMAGES_URL(), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as [];
};

export const uploadUserImages = async (requestBody: UserPostPictureRequestDto) => {
  const result = await axios
    .post(UPLOAD_USER_IMAGES_URL(), requestBody, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as DefaultResponse;
};

//feed api

const token = Cookies.get("accessToken");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export const NON_MEMBER_FIND_ALL_FEED_URL = () => `${API_DOMAIN}/user/feeds/non-member`;
export const FIND_ALL_FEED_URL = () => `${API_DOMAIN}/user/feeds`;
export const FIND_MY_FEED_URL = () => `${API_DOMAIN}/user/feeds/history`;
export const FIND_ONE_FEED_URL = (id: number) => `${API_DOMAIN}/user/feeds/${id}`;
export const FIND_LIKE_FEED_URL = () => `${API_DOMAIN}/user/feeds/likes`;
export const CREATE_FEED_URL = () => `${API_DOMAIN}/user/feeds/feed`;
export const UPDATE_FEED_URL = (id: number) => `${API_DOMAIN}/user/feeds/${id}/feed`;
export const DELETE_FEED_URL = (id: number) => `${API_DOMAIN}/user/feeds/${id}`;
export const FEED_ADD_LIKE_URL = (id: number) => `${API_DOMAIN}/user/feeds/${id}/like`;
export const FEED_DELETE_LIKE_URL = (id: number) => `${API_DOMAIN}/user/feeds/${id}/like`;
export const FEED_REPORT_URL = (id: number) => `${API_DOMAIN}/user/feeds/${id}/report`;
export const CONTENT_SEARCH_FEED_URL = (content: string) => `${API_DOMAIN}/user/search/content/${content}`;
export const NON_MEMBER_CONTENT_SEARCH_FEED_URL = (content: string) =>
  `${API_DOMAIN}/user/search/non-member/content/${content}`;
export const CATEGORY_SEARCH_FEED_URL = (category: string) => `${API_DOMAIN}/user/search/category/${category}`;
export const NON_MEMBER_CATEGORY_SEARCH_FEED_URL = (category: string) =>
  `${API_DOMAIN}/user/search/non-member/category/${category}`;

export const nonMemberFindAllFeed = async (page: number) => {
  const result = await axios
    .get(NON_MEMBER_FIND_ALL_FEED_URL(), {
      params: {
        page: page,
        size: 300,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

export const findAllFeed = async (page: number, token: string) => {
  const result = await axios
    .get(FIND_ALL_FEED_URL(), {
      params: {
        page: page,
        size: 300,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

export const findMyFeed = async (page: number, token: string) => {
  const result = await axios
    .get(FIND_MY_FEED_URL(), {
      params: {
        page: page,
        size: 300,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

export const findOneFeed = async (id: number, token: string) => {
  const result = await axios
    .get(FIND_ONE_FEED_URL(id), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiOneResponse;
};

export const findLikeFeed = async (token: string) => {
  const result = await axios
    .get(FIND_LIKE_FEED_URL(), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

export const createFeed = async (requsetBody: CreateFeedRequestDto) => {
  const result = await axios
    .post(CREATE_FEED_URL(), requsetBody, {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

export const updateFeed = async (requestBody: UpdateFeedRequestDto, id: number) => {
  const result = await axios
    .put(UPDATE_FEED_URL(id), requestBody, {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

export const deleteFeed = async (id: number) => {
  const result = await axios
    .delete(DELETE_FEED_URL(id), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

export const contentSearchFeed = async (content: string, page: number, token: string) => {
  const result = await axios
    .get(CONTENT_SEARCH_FEED_URL(content), {
      params: {
        page: page,
        size: 300,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

export const nonMemberContentSearchFeed = async (content: string, page: number) => {
  const result = await axios
    .get(NON_MEMBER_CONTENT_SEARCH_FEED_URL(content), {
      params: {
        page: page,
        size: 300,
      },
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

export const categorySearchFeed = async (category: string, page: number, token: string) => {
  const result = await axios
    .get(CATEGORY_SEARCH_FEED_URL(category), {
      params: {
        page: page,
        size: 300,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

export const nonMemberCategorySearchFeed = async (category: string, page: number) => {
  const result = await axios
    .get(NON_MEMBER_CATEGORY_SEARCH_FEED_URL(category), {
      params: {
        page: page,
        size: 300,
      },
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

//post요청 시 body가 먼저 들어가야되기때문에 reauestBody사용 안하고 path로 값을 넘겨줄 경우에 빈 객체를 넣어줘야 된다
export const feedAddLike = async (id: any) => {
  const result = await axios
    .post(
      FEED_ADD_LIKE_URL(id),
      {},
      {
        headers: headers,
        withCredentials: true,
      }
    )
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};

export const feedDeleteLike = async (id: any) => {
  const result = await axios
    .delete(FEED_DELETE_LIKE_URL(id), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};

export const feedReport = async (id: number) => {
  const result = await axios
    .post(
      FEED_REPORT_URL(id),
      {},
      {
        headers: headers,
        withCredentials: true,
      }
    )
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};

//moody-match api
export const MOODY_MATCH_FEED_URL = (userId: string) => `${API_DOMAIN}/user/feeds/${userId}/moody-match`;

export const moodyMatchFeed = async (userId: string, token: string) => {
  const result = await axios
    .get(MOODY_MATCH_FEED_URL(userId), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiResponse;
};

//diary api
export const FIND_ALL_DIARY_URL = () => `${API_DOMAIN}/diary/diaryList`;
export const FIND_ONE_DIARY_URL = (diaryId: number) => `${API_DOMAIN}/diary/${diaryId}`;
export const CREATE_DIARY_URL = () => `${API_DOMAIN}/diary`;
export const UPDATE_DIARY_URL = (diaryId: number) => `${API_DOMAIN}/diary/${diaryId}`;
export const DELETE_DIARY_URL = (diaryId: number) => `${API_DOMAIN}/diary/${diaryId}`;
export const DIARY_BOOKMARK_URL = (diaryId: string) => `${API_DOMAIN}/diary/${diaryId}/bookMark`;

export const findAllDiary = async (token: string) => {
  const result = await axios
    .get(FIND_ALL_DIARY_URL(), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiDiaryResponse;
};

export const findOneDiary = async (diaryId: number) => {
  const result = await axios
    .get(FIND_ONE_DIARY_URL(diaryId), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiOneDiaryResponse;
};

export const createDiary = async (requestBody: CreateDiaryRequestDto) => {
  const result = await axios
    .post(CREATE_DIARY_URL(), requestBody, {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as DefaultResponse;
};

export const updateDiary = async (requestBody: UpdateDiaryRequestDto, diaryId: number) => {
  const result = await axios
    .patch(UPDATE_DIARY_URL(diaryId), requestBody, {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as DefaultResponse;
};

export const deleteDiary = async (diaryId: number) => {
  const result = await axios
    .delete(DELETE_DIARY_URL(diaryId), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as DefaultResponse;
};

export const changeDiaryBookmark = async (diaryId: string) => {
  const result = await axios
    .put(
      DIARY_BOOKMARK_URL(diaryId),
      {},
      {
        headers: headers,
        withCredentials: true,
      }
    )
    .then(responseHandler)
    .catch(errorHandler);
  return result as DefaultResponse;
};

//admin api
export const FIND_ALL_REPORT_SIZE_URL = () => `${API_DOMAIN}/admin/reports/size`;
export const FIND_ALL_REPORT_URL = () => `${API_DOMAIN}/admin/reports`;
export const DELETE_REPORT_URL = (id: number) => `${API_DOMAIN}/admin/${id}`;
export const FIND_SUSPENSION_USER_SIZE_URL = () => `${API_DOMAIN}/admin/user/suspension/size`;
export const FIND_SUSPENSION_USER_URL = () => `${API_DOMAIN}/admin/user/suspension`;
export const APPLY_SUSPENSION_URL = (userId: string) => `${API_DOMAIN}/admin/${userId}`;

export const findAllReportSize = async (page: number) => {
  const result = await axios
    .get(FIND_ALL_REPORT_SIZE_URL(), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};

export const findAllReport = async (page: number) => {
  const result = await axios
    .get(FIND_ALL_REPORT_URL(), {
      params: {
        page: page,
        size: 10,
      },
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiReportResponse;
};

export const deleteReport = async (id: number) => {
  const result = await axios
    .delete(DELETE_REPORT_URL(id), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as DefaultResponse;
};

export const findSuspensionUsersSize = async () => {
  const result = await axios
    .get(FIND_SUSPENSION_USER_SIZE_URL(), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};

export const findSuspensionUsers = async (page: number) => {
  const result = await axios
    .get(FIND_SUSPENSION_USER_URL(), {
      params: {
        page: page,
        size: 10,
      },
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result as ApiSuspensionResponse;
};

export const applySuspesion = async (userId: string) => {
  const result = await axios
    .put(
      APPLY_SUSPENSION_URL(userId),
      {},
      {
        headers: headers,
        withCredentials: true,
      }
    )
    .then(responseHandler)
    .catch(errorHandler);
  return result as DefaultResponse;
};
