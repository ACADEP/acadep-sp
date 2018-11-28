import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  events = [
    'evento 1',
    'evento 2',
    'evento 3',
    'evento 4',
    'evento 5',

  ]

  constructor() { }

  ngOnInit() {
  }

}
