import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, Schedule, ScheduleEvent } from '../../_models/index';
import * as moment from 'moment';

@Component({
  selector: 'app-day-box',
  templateUrl: './day-box.component.html',
  styleUrls: ['./day-box.component.css']
})
export class DayBoxComponent implements OnInit {
  @Input()
  personsSchedules: Array<Person>;//Arreglo de personas con sus respectivos schedules
  @Input()
  dayOfWeek: string; //Día de la semana en formato string(ej: 'lunes')
  @Output()
  selectSchedule = new EventEmitter<ScheduleEvent>();

  constructor() { }

  ngOnInit() {
  }

  checkScheduleWeek(weekSchedule, day) {
    let checkSchedule = (weekSchedule.schedules.length > 0);
    let checkday = false;

    if (checkSchedule) {
      for (let i = 0; i < weekSchedule.schedules.length; i++) {
        let dayInWeek = this.drawDayinWeek(weekSchedule.schedules[i], day);
        if (dayInWeek) {
          checkday = dayInWeek;
          break;
        }
      }
    }
    return checkday;
  }

  drawDayinWeek(weekSchedule, dayWeek) {
    let dayFromSchedule = weekSchedule.day + '-' + weekSchedule.month + '-' + weekSchedule.year;
    let dayMomentFormat = moment(dayFromSchedule, 'DD-MM-YYY').format('dddd');
    let comparateDay = (dayMomentFormat == dayWeek);
    return comparateDay;
  }

  putBoxInDayWeek(scheduleweek) {
    let initHour = scheduleweek.initHour * 2;
    let durationTurn = scheduleweek.duration * 2;
    let heightBox = 48;
    let heightTurn = ((initHour + durationTurn) > heightBox) ? (- initHour + heightBox) : durationTurn;
    let postionTop = 'posH' + initHour;
    let heightBar = 'heightSize' + heightTurn;
    let classes = postionTop + ' ' + heightBar;
    return classes;
  }

  convertToHours(time) {
    let timecoverted = moment(time, 'hours').format("HH:mm");
    return timecoverted;
  }

  getInfoTime(schedule) {
    let initHourMoment = this.convertToHours(schedule.initHour);
    let endHour = schedule.initHour + schedule.duration;
    let validEndHour = (endHour > 24 ? 24 : endHour);
    let endHourMoment = this.convertToHours(validEndHour);
    let timetoshow = endHourMoment;
    return timetoshow;
  }

  onSelectSchedule(schedule: Schedule, person: Person) {
    this.selectSchedule.emit(new ScheduleEvent(schedule, person));
  }
}
