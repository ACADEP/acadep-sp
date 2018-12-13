export interface Event {
    id? : string;
    name : string;
    description : string,
    start : string;
    end : string;
    user_id : string;
    activity_id : string;
    tools : string [];
    active : boolean;
}
