export interface projExcel {
    name: string,
    activities: actExcel[]
    fecha_inicio: string
    fecha_final: string
    // subprojects: string[]
  }
export interface actExcel {
    name: string,
    // subproject: string,
    events: eventExcel[]
    project_id?: string
    fecha_inicio: string
    fecha_final: string
  }
export interface eventExcel {
    fecha_inicio: string
    fecha_final: string
    activity_name?: string
    name: string,
    description: string,
    activity_id?: string
    unit: string
    number: number
    user_mail: string
    // activiy_id : string
  }

export interface importProject {
    project : string
    activity : string
    event : string
}