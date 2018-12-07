import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, ElementRef, Renderer } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DpDatePickerModule, DatePickerComponent } from 'ng2-date-picker';
import { MatSelectModule } from '@angular/material/select';
import * as moment from 'moment';
import { ScheduleService, PersonService, LocationService, CategoryService, Constants } from '../../_services/index';
import { Schedule, Category, Person, Location, ScheduleEvent } from '../../_models/index';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  providers: [ScheduleService, LocationService, CategoryService, PersonService],
  encapsulation: ViewEncapsulation.None
})

export class ScheduleComponent implements OnInit, AfterViewInit {
  public schedules: Array<Schedule>;
  public schedule: Schedule;
  public personsSchedules: Array<Person> = [];
  public locations: Array<Location>;
  public categories: Array<Category>;
  public userLog;
  public overlay: boolean = false;
  public reportOpen: boolean = false;
  public TITTLE:string = 'Calendario';
  public ROLES: any = {
    SUPER_ADMIN: 'SuperAdmin',
    ADMIN: 'Admin',
    BOSS: 'Jefe',
    EMPLOYEE: 'Empleado'
  }
  public scheduleDate: Date;
  
  public scheduleInitialHour;
  public scheduleDurationHour;

  //Variable booleana que define si se visualiza dia(true) o semana(false)
  public isDaySelected: boolean = false;
  //Objeto que se utiliza para enviar query sobre el servicio de personsSchedule
  public datePicked: any;
  public personEditSchedule: any;
  public searchQuery: any = {
    date: '',
    locationId: '',
    categoryId: '',
    beginDate: '',
    endDate: ''
  };

  @ViewChild('weekPicker') weekPicker: DatePickerComponent;
  @ViewChild('dayPicker') dayPicker: DatePickerComponent;

  datePickerConfig = {
    format: 'MMM DD - YYYY',
    firstDayOfWeek: 'mo',
    locale: 'es'
  };

  datePickerConfigOverlay = {
    format: 'YYYY-MM-DD',
    firstDayOfWeek: 'mo',
    locale: 'es'
  };

  datePickerTime = {
    showTwentyFourHours: true,
    format: 'HH:mm',
    hours24Format: 'HH',
    minutesInterval: 30,
    showSeconds: false,
    firstDayOfWeek: 'mo',
    locale: 'es'   
  };

  datePickerConfigWeek = {
    format: 'YYYY-MM-DD',
    firstDayOfWeek: 'mo',
    showWeekNumbers: true,
    disableKeypress: true,
    closeOnSelect: true,
    closeOnSelectDelay: 100,
    allowMultiSelect: false,
    locale: 'es'
  };

  constructor(
    private personService: PersonService,
    private locationService: LocationService,
    private categoryService: CategoryService,
    private notificationService: NotificationsService,
    private scheduleService: ScheduleService,
    private el: ElementRef,
    private renderer: Renderer
  ) { }

  ngOnInit() {
    this.getLocations();
    this.getCategories();
    this.initSchedule();
    this.userLog = JSON.parse(localStorage.getItem('loggedUser'));
    this.validateUserRole();
  }

  ngAfterViewInit() {
   this.datePicked = moment();
   this.onSelectDate(this.datePicked);
  }

  getLocations() {
    this.locationService
      .getLocations()
      .subscribe(data => {
        this.locations = data;
      });
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .subscribe(data => {
        this.categories = data;
      });
  }

  saveSchedule(schedule: Schedule): void {
    this.scheduleService
      .saveSchedule(schedule)
      .subscribe(data => {
        this.notificationService.success(this.TITTLE, data.message);
        this.getPersonsSchedules(this.searchQuery);
        this.closeOverlay();
        this.initSchedule();
      }, 
      errResponse => {
        console.log("err ", errResponse);
        if(errResponse._body){
          let errBody = JSON.parse(errResponse._body);
          this.notificationService.success(this.TITTLE, errBody.message);
        }
      });
  }

  /*Overlay control*/
  closeOverlay() {
    this.overlay = false;
  }

  openOverlay() {
    this.overlay = true;
  }

  /**
   * [Metodo que se ejecuta cuando se va a editar un schedule, se pobla el ngModel schedule con el schedule que ingresa como parametro de entrada]
   * @param  {[type]} schedule [description]
   * @param  {[type]} person   [description]
   * @return {[type]}          [description]
   */
  editSchedulebyPerson(schedule, person) {
    this.scheduleDate = new Date(`${schedule.month}/${schedule.day}/${schedule.year}`);
    this.personEditSchedule = Object.assign({},person);
    this.schedule = Object.assign({},schedule);

    this.scheduleDurationHour = this.convertToHours(this.schedule.duration);
    this.scheduleInitialHour = this.convertToHours(this.schedule.initHour);

    this.openOverlay();
  }

  /**
   * [Metodo que se ejecuta al crear un nuevo schedule, se asigna la fecha al ngModel de fecha y se pobla el objeto de tipo schedule a crear]
   * @param  {[type]} person [description]
   * @return {[type]}        [description]
   */
  onNewSchedule(person) {
    if (!this.datePicked) {
      this.datePicked = moment();
    }
    this.assignScheduleDate(this.datePicked.toDate());
    this.personEditSchedule = person;
    this.schedule.location = person.location;
    this.schedule.person = person;

    this.scheduleDurationHour = '00:00';
    this.scheduleInitialHour = '00:00';

    this.openOverlay();
  }

  onSelectDate(date): void {
    if (this.isDaySelected) {
      let formattedDate = moment(date).format('YYYY-MM-DD');
      let dayToShow = moment(date).format('MMMM DD - YYYY');
      this.searchQuery.date = formattedDate;
      this.searchQuery.beginDate = '';
      this.searchQuery.endDate = '';
      this.dayPicker.inputElementValue = dayToShow;
    } else {
      let weeknumber = moment(date).week();
      let beginDate = moment(date).weekday(0).format('YYYY-MM-DD');
      let endDate = moment(date).weekday(6).format('YYYY-MM-DD');
      let beginDateToShow = moment(beginDate).format('MMM DD YYYY');
      let endDateToShow = moment(endDate).format('MMM DD YYYY');
      this.searchQuery.date = '';
      this.searchQuery.beginDate = beginDate;
      this.searchQuery.endDate = endDate;
      this.weekPicker.inputElementValue = beginDateToShow + ' - ' + endDateToShow;
    }
    this.getPersonsSchedules(this.searchQuery);
  }

  getPersonsSchedules(query: any = {}) {
    this
      .scheduleService
      .getPersonsSchedules(query)
      .subscribe(data => {
        this.personsSchedules = data;
      });
  }

  getInfoTime(schedule) {
    let initHourMoment = this.convertToHours(schedule.initHour);
    let endHour = schedule.initHour + schedule.duration;
    let validEndHour = (endHour > 24 ? 24 : endHour);
    let endHourMoment = this.convertToHours(validEndHour);
    let timetoshow = endHourMoment;
    return timetoshow;
  }

  checkLimitHalfHours(daySchedule, halfHourIndex) {
    let initHour = daySchedule.initHour * 2;
    let halfHour = halfHourIndex + 1;
    let checkHour = ((initHour + halfHour) > 48);
    return checkHour;
  }

  convertToHours(time) {
    let timecoverted = moment(time, 'hours').format("HH:mm");
    return timecoverted;
  }

  /*Metodo que valida que rol tiene el usuario logueado para verificar como se pintan los selectores y definir el filtro searchQuery para consultar*/
  validateUserRole() {
    if (this.userLog.role.name === this.ROLES.ADMIN) {
      this.searchQuery.locationId = this.userLog.location._id;
    }
    if (this.userLog.role.name === this.ROLES.BOSS) {
      this.searchQuery.locationId = this.userLog.location._id;
      this.searchQuery.categoryId = this.userLog.category._id;
    }
  }

  /*Metodo que recibe una fecha y la divide en día, mes y año y las asigna el modelo schedule*/
  assignScheduleDate(date): void {
   
    this.scheduleDate =  (typeof date == 'string') ?  moment(date, 'YYYY-MM-DD').toDate() : date;

    this.schedule.day = this.scheduleDate.getDate();
    this.schedule.month = this.scheduleDate.getMonth() + 1;
    this.schedule.year = this.scheduleDate.getFullYear();
  }


  /*funcion para validar horas y fechas al guardar o actualizar un schedule*/
  validateScheduleHours(schedule){
    let ih = this.scheduleInitialHour;
    let dh = this.scheduleDurationHour;
    let initialHour = Number(this.convertHourstoNumbers(ih) );
    let DurationHour = Number(this.convertHourstoNumbers(dh) );    
    
    schedule.initHour = initialHour;    
    schedule.duration = DurationHour;

    if(DurationHour!==0){
      this.saveSchedule(schedule);
    }
  }

  convertHourstoNumbers(hours){
    let hoursFormat = (hours instanceof moment) ? moment(hours).format('LT') : hours;
    let hoursNumber = moment.duration(hoursFormat).asHours();
    let decimalFix = Math.round(hoursNumber * 10) / 10;
    let roundHalf = (Math.round(decimalFix*2)/2).toFixed(1);      

    return roundHalf;
  }

  

  /*funcion para resaltar los horarios en la semana segun la persona seleccionada*/
  onMouseEnterWeek(person){

    let color = person.personColor;
    let bgBox = 'rgba(70,137,62,0.1)';
    //let selector = '.'+person.firstname+person._id;
    let selector = '.personColor'+person._id;

    let allClases = this.el.nativeElement.querySelectorAll(selector);
    let allWeekBox = this.el.nativeElement.querySelectorAll('.weekly-assigment-box');
    let allWeekBoxSelect = this.el.nativeElement.querySelectorAll(selector+'> .inner-box');
    let allWeekBoxSelectToolTip = this.el.nativeElement.querySelectorAll(selector+'> .inner-box > .tool-tip-over-color');    

    for (let j = 0; j < allWeekBox.length; j++) { 
      this.renderer.setElementStyle(allWeekBox[j], 'opacity', '0.2');
    }

    for (let k = 0; k < allWeekBoxSelect.length; k++) { 
      this.renderer.setElementStyle(allWeekBoxSelect[k], 'backgroundColor', color);
    }

    for (let l = 0; l < allWeekBoxSelectToolTip.length; l++) { 
      this.renderer.setElementStyle(allWeekBoxSelectToolTip[l], 'display', 'block');
    }

    for (let i = 0; i < allClases.length; i++) { 
        this.renderer.setElementStyle(allClases[i], 'backgroundColor', bgBox);
        this.renderer.setElementStyle(allClases[i], 'opacity', '1');
        this.renderer.setElementStyle(allClases[i], 'color', color);
    }    
  }

  onMouseLeaveWeek(person){

    let color = '';
    //let selector = '.'+person.firstname+person._id;
    let selector = '.personColor'+person._id;
    
    let allClases = this.el.nativeElement.querySelectorAll(selector);
    let allWeekBox = this.el.nativeElement.querySelectorAll('.weekly-assigment-box');

    let allWeekBoxSelect = this.el.nativeElement.querySelectorAll(selector+'> .inner-box');
    let allWeekBoxSelectToolTip = this.el.nativeElement.querySelectorAll(selector+'> .inner-box > .tool-tip-over-color');


    for (let k = 0; k < allWeekBoxSelect.length; k++) { 
      this.renderer.setElementStyle(allWeekBoxSelect[k], 'backgroundColor', color);
    }

    for (let j = 0; j < allWeekBox.length; j++) { 
      this.renderer.setElementStyle(allWeekBox[j], 'opacity', color);
    }

    for (let l = 0; l < allWeekBoxSelectToolTip.length; l++) { 
      this.renderer.setElementStyle(allWeekBoxSelectToolTip[l], 'display', 'none');
    }

    for (let i = 0; i < allClases.length; i++) { 
        this.renderer.setElementStyle(allClases[i], 'backgroundColor', color);
        this.renderer.setElementStyle(allClases[i], 'opacity', color);
        this.renderer.setElementStyle(allClases[i], 'color', color);
    }
  }

  /**
   * Metodo que inicializa initSchedule
   */
  initSchedule(): void {
    this.schedule = new Schedule(
      null,
      true,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

  onSelectSchedule(scheduleEvent: ScheduleEvent): void {
    this.editSchedulebyPerson(scheduleEvent.schedule, scheduleEvent.person);
  }

   /**
   * Método que limpia todos los atributos no booleanos de un objeto por referencia
   * @param {any} object [description]
   */
  cleanObject(object: any): void {
    for (let key in object) {
      if (typeof object[key] !== 'boolean' && typeof object[key] !== 'function') {
        object[key] = null;
      }
    }
  }

}
