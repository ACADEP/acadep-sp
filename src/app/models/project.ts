import { datetime } from "../models/datetime";

export interface project {
id?: string;
name:string;
description: string;
ubication: {
    lat : number,
    lng : number
};
start: datetime;
end: datetime;
administrators: string[];
}
