import { Injectable } from '@angular/core';
import { Router, CanActivate,  ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class RoleGuardService implements CanActivate {


    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {

        let roles = route.data['roles'] as Array<string>;
        let actualRol = JSON.parse(localStorage.getItem('role'));        

        return (roles == null || roles.indexOf(actualRol) != -1);
        
    }

}