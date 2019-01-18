import { Component, OnInit, ViewChild } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { map } from 'rxjs/operators';
import { EvidenceService } from "../../services/evidence.service";
import { MatAccordion } from '@angular/material';


declare var $ : any;

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styleUrls: ['./evidence.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush

})
export class EvidenceComponent implements OnInit {

  public src: string;
  items: GalleryItem[];
  evidenceCollection: any[];

  @ViewChild('myaccordion') myPanels: MatAccordion;

  constructor(public gallery: Gallery, public evidenceService : EvidenceService) {
  }

  ngOnInit() {

    this.evidenceService.getEvents().subscribe(events => {
      this.evidenceCollection = events;
      // this.evidenceCollection[0].description.get().then((doc) => {
      //   console.log(doc.data())
      // }).catch((err) => {
      //   console.log(err)
      // });
    })
  }

  openAll(){
    this.myPanels.openAll();
  }

  closeAll(){
    this.myPanels.closeAll();
  }

  showImage(event){
    this.src = event.target.src;
    $('#showimage').modal('show');
    console.log(event)
  }

  getColor(type){
    switch (type) {
      case 'pdf':
        return '#f43636'
        
      case 'word':
        return '#3672f4'
    
      default:
      return 'inherit'
    }
  }

  
}
