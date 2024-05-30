import ResponseDto from "../response.dto";

export default interface RefreshTokenResponseDto extends ResponseDto {
  token: string;
}
