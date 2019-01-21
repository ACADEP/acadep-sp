// import { datetime } from "../models/datetime";

export interface project {
id?: string;
name:string;
description: string;
ubication: {
    lat : number,
    lng : number
};
start: string;
end: string;
administrators: string[];

subprojects : string[];
}
