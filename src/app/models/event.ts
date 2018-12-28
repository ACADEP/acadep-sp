
import { tool } from "./tool";
// import { Time } from "@angular/common";
interface datetime{
    date: string;
    time: string;
}

export interface Event {
    id? : string;
    name : string;
    description : string,
    start : datetime;
    end : datetime;
    type : string;
    user_id : string;
    activity_id : string;
    tools : tool [];
    personal : tool [];
    active : boolean;
}
