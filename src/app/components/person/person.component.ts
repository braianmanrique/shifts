import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { PersonService, LocationService, CategoryService, RoleService, Constants } from '../../_services/index';
import { Person, Category, Location, Role } from '../../_models/index';

@Component({
  selector: 'person',
  templateUrl: './person.component.html',
  providers: [PersonService, LocationService, CategoryService, RoleService]
})

export class PersonComponent implements OnInit {
  public persons: Array<Person>;
  public person: Person;
  public categories: Array<Category>;
  public locations: Array<Location>;
  public roles: Array<Role>;
  public ocupationsList;
  public userLog;
  public categoryFilter;
  public locationFilter;
  public PAG_ITEMS_NUMBER: number = 10;
  public page: number = 1;
  public overlay : boolean = false;
  public edit: boolean = false;
  public TITTLE:string = 'Personas';

  constructor(
    private personService: PersonService,
    private notificationService: NotificationsService,
    private locationService: LocationService,
    private categoryService: CategoryService,
    private roleService: RoleService
  ) { }

  

  ngOnInit() {
    this.userLog = JSON.parse(localStorage.getItem('loggedUser'));
    this.checkRolUserFilter();

    this.getPersons();
    this.getRoles();
    this.getCategories();
    this.getLocations();
    this.person = new Person(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      true,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
    this.ocupationsList = Constants.OCUPATION_LIST;
  }  

  getPersons(): void {
    this.personService
      .getPersons(this.locationFilter,this.categoryFilter)
      .subscribe(data => {
        this.persons = data;
      });
  }

  savePerson(person: Person): void {
    this.personService
      .savePerson(person)
      .subscribe(data => {
        this.notificationService.success(this.TITTLE, data.message.message);
        this.getPersons();
      });
  }

  getRoles() {
    this.roleService
      .getRoles()
      .subscribe(data => {
        this.roles = data;
      });
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .subscribe(data => {
        this.categories = data;
      });
  }

  getLocations() {
    this.locationService
      .getLocations()
      .subscribe(data => {
        this.locations = data;
      });
  }

  /*Check roles for filter person*/
  checkRolUserFilter(){
    switch (this.userLog.role.name) {
      case "Admin":
        this.locationFilter = this.userLog.location._id;
        break;
      case "Jefe":
        this.locationFilter = this.userLog.location._id;
        this.categoryFilter = this.userLog.category._id;
        break;
    }
  }

  /*check selects*/
  compareSelects(item1,item2){
      return item1 && item2 ? item1._id === item2._id : item1 === item2;    
  }

  /*Overlay control*/
  closeOverlay() {
    this.getPersons();
    //this.overlayDiv.classList.remove('show');
    this.overlay = false;
  }

  openOverlay(person) {
    if (this.edit) {
      //let indexPersonSelect = index.target.attributes.dataIndex.value;
      //this.person = this.persons[indexPersonSelect];
      this.person= person;
      console.log(this.person);
    } else {
      this.person = new Person(null, null, null, null, null, null, null, null, null, true, null, null, null, null, null, null, null);
    }
    this.overlay = true;
  }

}
