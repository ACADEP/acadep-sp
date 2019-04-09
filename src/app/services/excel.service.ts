// import { Injectable } from '@angular/core';
// import { projExcel, actExcel, eventExcel } from "../models/excel";
// import { ProjectsService } from "../services/projects.service";
// import { ActivitiesService } from "../services/activities.service";
// import { EventsService } from "../services/events.service";

// @Injectable({
//   providedIn: 'root'
// })
// export class ExcelService {

//   constructor(
//   public projectsService : ProjectsService,
//   public activitiesService : ActivitiesService,
//   public eventsService : EventsService,
//   ) { }


//   importActivities( json : any , project_id){

//     json.map((project: projExcel) => {
//       this.projectsService.importProject(project).then((proj: any) => {
//         project.activities.map((activity: actExcel) => {
//           activity.project_id = proj.id;
//           this.activitiesService.ImportActivity(activity).then((act: any) => {
//             activity.events.map((event: eventExcel) => {
//               event.activity_name = activity.name;
//               event.activity_id = act.id;
//               this.eventsService.ImportEvent(event).then(final => {
//                 cont++;
//                 let percentage = Math.round((100 * cont) / total) + '%';
//                 this.percent = percentage;
//                 console.log(Math.round((100 * cont) / total) + '%')
//               })
//             })
//           })
//         })
//       }).catch((err) => { console.log(err) });
//     })

//   }
// }
