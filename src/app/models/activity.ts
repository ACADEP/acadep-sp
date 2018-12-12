export interface activity {
    id:string;
    name: string;
    type: string;
    description: string;
    tools : string[];
    project_id : string;
    users: string[];
    start: Date;
    end: Date;
    deleted : any
  }