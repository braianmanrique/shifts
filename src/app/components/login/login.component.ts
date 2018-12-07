import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Person } from '../../_models/index';
import { LoginService, Constants } from '../../_services/index';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [LoginService]
})

/**
 * [Componente que contiene todos los metodos correspondientes a la autenticación de usuarios]
 * @param  {LoginService} privateuserService [description]
 */
export class LoginComponent implements OnInit {
  public user: Person;
  public TITLE: string = 'Login';

  @Output()
  login = new EventEmitter<Person>();

  constructor(
    private userService: LoginService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit() {
    this.user = new Person(
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
  }

  /**
   * [Evento que se ejecuta al momento de hacer submit en el formulario de login, este invoca el servicio de login hacia el modulo de autenticación, guarda el token y el usuario autenticado en el local storage]
   */
  onLogin(): void {
    this.userService.login(this.user).subscribe(
      data => {
        localStorage.setItem('token', data.token);
        this.user._id = data.user.id;
        this.user.firstname = data.user.firstname;
        this.user.lastname = data.user.lastname;
        this.user.email = data.user.email;
        this.user.username = data.user.username;
        this.user.category = data.user.category;
        this.user.location = data.user.location;
        this.user.identification = data.user.identification;
        this.user.phoneNumber = data.user.phoneNumber;
        this.user.creationDate = data.user.creationDate;
        this.user.creationUsername = data.user.creationUsername;
        this.user.modificationDate = data.user.modificationDate;
        this.user.modificationUsername = data.user.modificationUsername;
        this.user.role = data.user.role;
        this.user.password = null;
        localStorage.setItem('loggedUser', JSON.stringify(this.user) );
        localStorage.setItem ('role', JSON.stringify(this.user.role.name) ); 
        this.emitLoggedUser(this.user);
      },
      errorResponse => {
        let body = JSON.parse(errorResponse._body);
        let errorMessage =  body.message.message;           
        this.notificationService.error(this.TITLE, errorMessage);
      }
    );
  }

  toggleDropdown($event) {
      let parentEl = $event.currentTarget.parentNode;
      let parentClass = parentEl.classList.contains('focusInput');
      if(!parentClass){
        parentEl.classList.add('focusInput');
      }else{
        parentEl.classList.remove('focusInput');
      }
  }

  /**
   * Metodo que emite un evento de tipo usuario con el usuario loggeado despues de realizar logIn
   * @param {Person} user [description]
   */
  emitLoggedUser(person: Person): void {
    this.login.emit(person);
  }
}
