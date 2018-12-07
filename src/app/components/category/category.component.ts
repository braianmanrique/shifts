import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Category, Location } from '../../_models/index';
import { NotificationsService } from 'angular2-notifications';
import { CategoryService, LocationService, Constants } from '../../_services/index';

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  providers: [CategoryService, LocationService]
})

export class CategoryComponent implements OnInit {
  public categories: Array<Category>;
  public category: Category; //Categoria para ngModel de formulario
  public locations: Array<Location>;

  public TITLE: string = 'Áreas';
  public overlayDiv;
  public olderName: string;
  public edit: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private locationService: LocationService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit() {
    this.getCategories();
    this.getLocations();
    this.category = new Category(null, null, null, null, null, null);
    this.overlayDiv = document.getElementById('overlay');
  }

  /**
   * Método que invoca servicio que trae listado de categorias/areas del backend
   */
  getCategories(): void {
    this.categoryService
      .getCategories()
      .subscribe(data => {
        this.categories = data;
      });
  }

  /**
   * Método que invoca servicio que guarda una categoria nueva o ya existente
   * @param {Category} category [Categoría]
   */
  saveCategory(category: Category): void {
    this.categoryService
      .saveCategory(category)
      .subscribe(response => {
        this.notificationService.success(this.TITLE, response.message.message);
        this.closeOverlay();
        this.getCategories();
      },
      errorResponse => {
        let body = JSON.parse(errorResponse._body);
        this.notificationService.error(this.TITLE, body.message.errors.name.message);
      });
  }

  getLocations() {
    this.locationService
      .getLocations()
      .subscribe(data => {
        this.locations = data;
      });
  }

  /*funcion para control del formulario*/
  formCategory(): void {
    if(this.olderName == this.category.name){
      this.notificationService.error(this.TITLE, Constants.NAME_DUPLICATE);
    }else{
      this.saveCategory(this.category);
    }
  }

  /*Overlay control*/

  closeOverlay(){
      this.overlayDiv.classList.remove('show');
  }
  openOverlay(name, id){
      this.category.name = name;
      this.olderName = name;
      this.category._id = id;
      this.overlayDiv.classList.add('show');
  }

}
