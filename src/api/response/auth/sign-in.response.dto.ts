import ResponseDto from "../response.dto";

export default interface SignInResponseDto extends ResponseDto {
  userId: string;
  token: string;
  expirationTime: number;
}
