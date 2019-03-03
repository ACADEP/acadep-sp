import { tool } from "./tool";

export interface activity {
    id:string;
    title: string;
    description: string;
    insumos : tool[];
    project_id : string;
    administrators: string[];
    start: string;
    end: string;
    deleted : any,
    subproject : string;
  }