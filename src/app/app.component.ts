import { Component, OnInit } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Person } from './_models/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public loggedUser: Person;
  public notificationOptions = {
    position: [
      'bottom',
      'right'
    ],
    timeOut: 1000,
    showProgressBar: true,
    lastOnBottom: true,
    clickToClose: true,
    animate: 'fromLeft'
  };

  ngOnInit() {
    if (this.loggedIn()){
      this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
  }

  /**
   * [Metodo que verifica si el token existe y si existe verifica si ya paso el tiempo de expiración]
   */
  loggedIn() {
    return tokenNotExpired();
  }


  /**
   * Metodo para hacer logOut, eliminar el objecto loggedUser y token del localStorage
   */
  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('role');
  }

  /**
   * Evento que se ejecuta cuando el componente de login retorna el usuario logueado
   * @param {Person} loggedPerson [description]
   */
  onLogin(loggedUser: Person): void {
    this.loggedUser = loggedUser;
    console.log('log user', this.loggedUser );
  }
}
