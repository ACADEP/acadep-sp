
export interface event_types {
name : string
before : boolean
during : boolean
after : boolean
}

export interface Config {
    event_types : event_types[]
    max_photos: number
    min_photos : number
}