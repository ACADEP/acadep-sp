
import { tool } from "./tool";

export interface Event {
    id? : string;
    name : string;
    description : string,
    start : string;
    end : string;
    type : string;
    user_id : string;
    activity_id : string;
    tools : tool [];
    personal : tool [];
    active : boolean;
}
