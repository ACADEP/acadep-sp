import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../../../services/projects.service";
import { snapshotChanges } from '@angular/fire/database';

@Component({
  selector: 'app-create-proyect',
  templateUrl: './create-proyect.component.html',
  styleUrls: ['./create-proyect.component.css']
})
export class CreateProyectComponent implements OnInit {
public algo:any;
  constructor(public projectsServide : ProjectsService) {
   
   }

  ngOnInit() {
  }

  printame(){
    this.algo = this.projectsServide.getProjects();
    this.algo.then((querySnapshot) =>{
      console.log(querySnapshot);
    })
  }

}
