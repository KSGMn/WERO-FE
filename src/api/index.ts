import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
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
import FeedFindAllRequestDto from "./request/feed/feed-find-all.request.dto";
import FeedFindAllResponseDto from "./response/feed/feed-find-all.response.dto";
import Cookies from "js-cookie";

const responseHandler = <T>(response: AxiosResponse<any, any>) => {
  const responseBody: T = response.data;
  return responseBody;
};

const errorHandler = (error: any) => {
  if (!error.response || !error.response.data) return null;
  const responseBody: ResponseDto = error.response.data;
  return responseBody;
};

const DOMAIN = "http://localhost:8080";
const API_DOMAIN = `${DOMAIN}/api/v1`;

//auth api

export const SNS_SIGN_IN_URL = (type: "kakao" | "naver") => `$(API_DOMAIN)/auth/oauth2/${type}`;
const LOG_OUT = () => `${API_DOMAIN}/auth/logout`;
const SING_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/register`;
const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;

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

//feed api

const token = Cookies.get("accessToken");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export const FIND_ALL_FEED_URL = (userId: string) => `${API_DOMAIN}/user/feeds/${userId}`;
export const FIND_MY_FEED_URL = (userId: string) => `${API_DOMAIN}/user/feeds/${userId}/history`;
export const FIND_LIKE_FEED_URL = (userId: string) => `${API_DOMAIN}/user/feeds/${userId}/likes`;
export const FEED_ADD_LIKE_URL = (userId: string, id: any) => `${API_DOMAIN}/user/feeds/${userId}/${id}/like`;
export const FEED_DELETE_LIKE_URL = (userId: string, id: any) => `${API_DOMAIN}/user/feeds/${userId}/${id}/like`;

export const findAllFeed = async (userId: string) => {
  const result = await axios
    .get(FIND_ALL_FEED_URL(userId), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};

export const findMyFeed = async (userId: string) => {
  const result = await axios
    .get(FIND_MY_FEED_URL(userId), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};

export const findLikeFeed = async (userId: string) => {
  const result = await axios
    .get(FIND_LIKE_FEED_URL(userId), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};

//post요청 시 body가 먼저 들어가야되기때문에 reauestBody사용 안하고 path로 값을 넘겨줄 경우에 빈 객체를 넣어줘야 된다
export const feedAddLike = async (userId: string, id: any) => {
  const result = await axios
    .post(
      FEED_ADD_LIKE_URL(userId, id),
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

export const feedDeleteLike = async (userId: string, id: any) => {
  const result = await axios
    .delete(FEED_DELETE_LIKE_URL(userId, id), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};

//moody-match api
export const MOODY_MATCH_FEED_URL = (userId: string) => `${API_DOMAIN}/user/feeds/${userId}/moody-match`;

export const moodyMatchFeed = async (userId: string) => {
  const result = await axios
    .get(MOODY_MATCH_FEED_URL(userId), {
      headers: headers,
      withCredentials: true,
    })
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};
