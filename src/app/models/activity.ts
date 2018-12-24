export interface activity {
    id:string;
    name: string;
    type: string;
    description: string;
    tools : string[];
    project_id : string;
    users: string[];
    start: string;
    end: string;
    deleted : any
  }