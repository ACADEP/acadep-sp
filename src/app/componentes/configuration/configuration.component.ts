import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { Config, event_types } from "../../models/config";
import { Observable } from 'rxjs';
import { ConfigService } from "../../services/config.service";
import * as XLSX from 'xlsx';
import { ProjectsService } from "../../services/projects.service";
import { ActivitiesService } from "../../services/activities.service";
import { EventsService } from "../../services/events.service";

export interface configPdf {
  img_header1: any,
  img_header2: string,
  text_header: string,
  text_footer: string
}

//interfaces excel
type AOA = any[][];

interface projExcel {
  name: string,
  activities: actExcel[]
  fecha_inicio: string
  fecha_final: string
  // subprojects: string[]
}
interface actExcel {
  name: string,
  // subproject: string,
  events: eventExcel[]
  project_id?: string
  fecha_inicio: string
  fecha_final: string
}
interface eventExcel {
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

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  public import: any;
  // public step1 : any;

  nameAct: string;
  public configGlobal = {} as Config;
  eventType = {} as event_types;
  public configPdf = {} as configPdf;
  loading: boolean = false;
  loading2: boolean = false;
  // uploadPercent: Observable<number>;
  urlimage: Observable<string>;

  private readonly notifier: NotifierService;

  //excel
  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  percent = '0%';

  constructor(public db: AngularFirestore,
    notifierService: NotifierService,
    public storage: AngularFireStorage,
    public configService: ConfigService,
    public projectsService: ProjectsService,
    public activitiesService: ActivitiesService,
    public eventsService: EventsService) {
    this.notifier = notifierService;
    this.configGlobal.event_types = [];
    this.eventType.name = "";
    this.eventType.before = false;
    this.eventType.during = false;
    this.eventType.after = false;
  }

  ngOnInit() {

    this.db.collection('configuration').doc('global').ref.get().then(doc => {
      this.configGlobal = doc.data() as Config;
      //  this.configGlobal.events_types = doc.data().activitys_types;
      // console.log(this.configGlobal.event_types)
    }).catch(err => {
      console.log('error inesperado: ' + err)
    })

    this.db.collection('configuration').doc('pdf').ref.get().then(doc => {
      this.configPdf = doc.data() as configPdf;
      // console.log(this.configPdf)
    }).catch(err => {
      console.log('error inesperado: ' + err)
    })

  }

  addType() {
    const type = {
      name: this.eventType.name,
      before: this.eventType.before,
      during: this.eventType.during,
      after: this.eventType.after
    }
    this.configGlobal.event_types.push(type);
    this.configService.saveConfig(this.configGlobal)
  }


  saveChanges(form: NgForm) {
    if (form.valid && this.configGlobal.min_photos < this.configGlobal.max_photos) {
      this.db.collection('configuration').doc('global').update({
        min_photos: this.configGlobal.min_photos,
        max_photos: this.configGlobal.max_photos,
        events_types: this.configGlobal.event_types
      }).then(res => {
        this.db.collection('configuration').doc('pdf').update({
          img_header1: this.configPdf.img_header1,
          img_header2: this.configPdf.img_header2,
          text_header: this.configPdf.text_header,
          text_footer: this.configPdf.text_footer
        }).then(res => {
          this.notifier.notify('success', 'Cambios guardados!');
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.notifier.notify('error', 'Por favor corrija los errores');
    }
  }

  uploadImage($event, photo) {
    if (photo == 1) {
      this.loading = true;
    } else {
      this.loading2 = true;
    }

    const id = Math.random().toString(36).substring(2);
    const file = $event.target.files[0];
    const filepath = `pdf_configuration/${id}`;

    const ref = this.storage.ref(filepath);
    const task = this.storage.upload(filepath, file).then(res => {
      // console.log(res.downloadURL)
      res.ref.getDownloadURL().then(url => {
        if (photo == 1) {
          this.loading = false;
          this.configPdf.img_header1 = url
        } else if (photo == 2) {
          this.loading2 = false;
          this.configPdf.img_header2 = url
        }
      })
    })
    // this.uploadPercent = ;
    // task.snapshotChanges().pipe(finalize(() => this.configPdf.img_header1 = ref.getDownloadURL())).subscribe();
  }

  Next(form) {
    if (form.valid) {
      this.import = form.value.option;
    } else {
      this.notifier.notify('error', 'Seleccione un tipo de importación')
    }
  }

  /**
   * Excel
   */
  onFileChange(evt: any) {
    const OnlyExtensions = ['xlsx', 'csv'] //extensiones disponibles
    const extensionFile = evt.target.files[0].name.split('.').pop();
    if (OnlyExtensions.includes(extensionFile)) { //validar extension
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length == 1) { // no multiples archivos
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          const array = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
          this.constructObject(array, wsname);
        };
        reader.readAsBinaryString(target.files[0]);
      } else {
        this.notifier.notify('error', 'No se permiten multiples archivos')
        throw new Error('No se permiten multiples archivos');
      }
    } else {
      this.notifier.notify('error', 'Extension no valida')
      throw new Error('Extension no valida');
    }

  }

  export(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

  jsonToFirebase(json: any, total: number) {
    // console.log(json)
    // console.log(total)
    this.percent = '0.1%'
    // Descomentar cuando termine test
    var cont = 0;
    json.map((project: projExcel) => {
      this.projectsService.importProject(project).then((proj: any) => {
        project.activities.map((activity: actExcel) => {
          activity.project_id = proj.id;
          this.activitiesService.ImportActivity(activity).then((act: any) => {
            activity.events.map((event: eventExcel) => {
              event.activity_name = activity.name;
              event.activity_id = act.id;
              this.eventsService.ImportEvent(event).then(final => {
                cont++;
                let percentage = Math.round((100 * cont) / total) + '%';
                this.percent = percentage;
                console.log(Math.round((100 * cont) / total) + '%')
              })
            })
          })
        })
      }).catch((err) => { console.log(err) });
    })
  }

  async constructObject(array, name) {
    var container = [];
    // var doc = {} as projExcel;
    // doc.name = name;
    // doc.activities = [];
    // doc.subprojects = [];
    var contSub = -1;
    var contAct = -1;
    var contEvent = 0;

    const arr = await array.map(element => {
      if (element[0] == 'subproyecto' || element[0] == 'Subproyecto') {
        const sub: projExcel = {
          name: element[1],
          activities: [],
          fecha_inicio: this.convertDate(element[2]),
          fecha_final: this.convertDate(element[3]),
        }
        container.push(sub);
        contSub++
        contAct = -1;
      }

      if (element[0] == 'actividad' || element[0] == 'Actividad') {
        contAct++;
        const act: actExcel = {
          name: element[1],
          events: [],
          fecha_inicio: this.convertDate(element[2]),
          fecha_final: this.convertDate(element[3]),
        }

        container[contSub].activities.push(act)
      }

      if (element[0] == 'evento' || element[0] == 'Evento') {

        contEvent++;
        const event: eventExcel = {
          name: element[1],
          description: '',
          unit: element[5],
          number: element[6],
          user_mail: element[4],
          fecha_inicio: this.convertDate(element[2]),
          fecha_final: this.convertDate(element[3]),
        }

        container[contSub].activities[contAct].events.push(event);

      }

    })

    this.jsonToFirebase(container, contEvent);
  }

  convertDate(excelDate) {

    return new Date((excelDate - (25567 + 1)) * 86400 * 1000).toJSON()

  }



}
