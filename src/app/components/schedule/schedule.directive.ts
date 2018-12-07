import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[weekSelector]'
})

export class WeekDirective{
   constructor(private el: ElementRef) {}

    ngAfterViewInit() {
      let allWeeksMonth = this.el.nativeElement.querySelectorAll('.dp-calendar-day');
      this.el.nativeElement.style.color = 'red';
  }
}
