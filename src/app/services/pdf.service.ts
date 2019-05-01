import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { map } from "rxjs/operators/map";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(
    private http : HttpClient
  ) { }


  
  // return this.http.get(this.heroesUrl, requestOptions)

  getPDF(event){

    const data = {
      images : [
        'https://firebasestorage.googleapis.com/v0/b/seguimiento-de-proyectos-4fa3c.appspot.com/o/images%2Fevidence%2FImg2019-03-15T04%3A37537b9623-8d34-4acc-aca6-9a513237ed8f?alt=media&token=0ddcfe3e-1882-40d4-90e1-b9b3d36c92f9',
        'https://firebasestorage.googleapis.com/v0/b/seguimiento-de-proyectos-4fa3c.appspot.com/o/images%2Fevidence%2FImg2019-03-15T04%3A42675371ab-ea2e-4d20-af22-a0b55717556d?alt=media&token=7d8f5164-7d75-4c61-a309-82cad2a480b6',
        'https://firebasestorage.googleapis.com/v0/b/seguimiento-de-proyectos-4fa3c.appspot.com/o/images%2Fevidence%2FImg2019-03-15T06%3A356eb41116-a875-4087-b8c7-764b79dc94b9?alt=media&token=05c7d995-ab8b-47d4-bd00-28aea62a7b8a'
      ],
      title: 'Sr. Figaredo Regaña a Rafiki',
      description : 'Se presume que rafiki publico un titulo mal que ellos escribieron',
      project : 'proyecto',
      activity : 'activity',
      event : 'event',
    }

    return new Promise((resolve, reject)=>{
      var settings = {
        "async": true,
        "data" : data,
        "crossDomain": true,
        "url": "https://cors-anywhere.herokuapp.com/http://pdf.tecnidepot.com/pdf",
        "method": "POST",
        "headers": {
          "Accept": "*/*",
          "Cache-Control": "no-cache",
          "cache-control": "no-cache",
        }
      }
      
      $.ajax(settings).done(function (response) {
        resolve(response);
      }).fail(function(err){
        reject(err)
      });

    });
  }

}
