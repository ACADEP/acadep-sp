
import { tool } from "./tool";
// import { datetime } from "./dateTime";


export interface Event {
  
    status : number;
    id? : string;
    title : string;
    description : string,
    start : string;
    end : string;
    type : string;
    user_id : string;
    activity_id : string;
    tools : tool [];
    staff : tool [];
    active : boolean;
}
