import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';

declare var $: any;

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  private readonly notifier: NotifierService;

  activityTypes = [

    'auditoria',
    'servicio',
    'supervision'

  ];

  tools = [];

  public time : boolean;
  public tool: string;
  constructor(notifierService: NotifierService) { 
    this.notifier = notifierService;
    this.time = false;

  }

  ngOnInit() {
  }


  pushTool()
  {
    // alert(value);
    
    this.tools.push(this.tool);
    this.tool = '';
  }

  deleteTool(item)
  {
    const index = this.tools.indexOf(item);
    this.tools.splice(index, 1);
  }

}
