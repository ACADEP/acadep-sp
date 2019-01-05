
import { tool } from "./tool";
import { datetime } from "./dateTime";


export interface Event {
  
    status : number;
    id? : string;
    name : string;
    description : string,
    start : datetime;
    end : datetime;
    type : string;
    user_id : string;
    activity_id : string;
    tools : tool [];
    staff : tool [];
    active : boolean;
}
