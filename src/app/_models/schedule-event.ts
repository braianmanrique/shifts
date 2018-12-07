import { Schedule, Person } from './index';

export class ScheduleEvent {
  constructor(
    public schedule: Schedule,
    public person: Person
  ) {}
}
