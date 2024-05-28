import ResponseDto from "../response.dto";

export default interface FeedFindAllResponseDto extends ResponseDto {
  mainfeed_id: string;
  content: string;
  trackName: string;
  image: string;
  create_date: string;
  modificate_date: string;
  category: string;
  liked: boolean;
}
