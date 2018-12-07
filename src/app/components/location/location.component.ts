import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Location } from '../../_models/location';
import { LocationService, Constants } from '../../_services/index';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  providers: [LocationService]
})

export class LocationComponent implements OnInit {
  public locations: Array<Location>;//Listado de ubicaciones
  public location: Location; //NgModel

  public overlayDiv;
  public olderName: string;
  public edit: boolean = false;
  public TITLE: string = 'Sitio';

  constructor(
    private locationService: LocationService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit() {
    this.getLocations();
    this.location = new Location(null, null, null, null, null, null);
    this.overlayDiv = document.getElementById('overlay');
  }

  /**
   * Método que invoca servicio que trae listado de ubicaciones del backend
   */
  getLocations(): void {
    this.locationService
      .getLocations()
      .subscribe(data => {
        this.locations = data;        
      });
  }

  /**
   * Método que invoca servicio que guarda una ubicación nueva o ya existente
   * @param {Location} Location [Ubicación a guardar]
   */
  saveLocation(location: Location): void {
    this.locationService
      .saveLocation(location)
      .subscribe(response => {
        this.notificationService.success(this.TITLE, response.message.message);
        this.closeOverlay();
        this.getLocations();
      },
      errorResponse => {        
        let body = JSON.parse(errorResponse._body);       
        this.notificationService.error(this.TITLE, body.message.errors.name.message);
      });
  }

  /*funcion para control del formulario*/
  formLocation(): void {
    if(this.olderName == this.location.name){
      this.notificationService.error(this.TITLE, Constants.NAME_DUPLICATE);
    }else{
      this.saveLocation(this.location);
    }    
  }

  /*Overlay control*/
  
  closeOverlay(){
      this.overlayDiv.classList.remove('show');      
  }
  openOverlay(name, id){
      this.location.name = name;
      this.olderName = name;
      this.location._id = id;       
      this.overlayDiv.classList.add('show');
  }

}
