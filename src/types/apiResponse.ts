// creating a standard for api response , so that the response is in one language and readable
import { Message } from "../model/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
}