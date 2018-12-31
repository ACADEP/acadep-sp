import { datetime } from "../models/datetime";

export interface project {
id?: string;
name:string;
description: string;
ubication: Geolocation;
start: datetime;
end: datetime;
administrators: string[];
}
