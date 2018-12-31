import { datetime } from "./dateTime";

export interface activity {
    id:string;
    name: string;
    type: string;
    description: string;
    tools : string[];
    project_id : string;
    users: string[];
    start: datetime;
    end: datetime;
    deleted : any
  }