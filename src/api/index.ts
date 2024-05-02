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
