import { datetime } from "./dateTime";
import { tool } from "./tool";

export interface activity {
    id:string;
    name: string;
    // type: string;
    description: string;
    material : tool[];
    project_id : string;
    users: string[];
    start: datetime;
    end: datetime;
    deleted : any
  }