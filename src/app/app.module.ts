import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { DpDatePickerModule } from 'ng2-date-picker';
import { AppComponent } from './app.component';
import { AuthModule } from './auth.module';
import { RoleGuardService } from './_guard/index';
import { LoginComponent, CategoryComponent, LocationComponent, PersonComponent, ScheduleComponent, WeekDirective, DayBoxComponent } from './components/index';
import { MatSelectModule } from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    LoginComponent,
    LocationComponent,
    CategoryComponent,
    PersonComponent,
    ScheduleComponent,
    WeekDirective,
    DayBoxComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing,
    AuthModule,
    BrowserAnimationsModule,
    DpDatePickerModule,
    MatSelectModule,
    SimpleNotificationsModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [RoleGuardService, appRoutingProviders],
  bootstrap: [AppComponent]
})

export class AppModule { }
