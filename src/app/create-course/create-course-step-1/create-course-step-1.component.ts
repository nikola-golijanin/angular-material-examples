import {Component} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {MatCalendarCellClassFunction} from "@angular/material/datepicker";
import {debounce, debounceTime} from "rxjs/operators";


@Component({
  selector: "create-course-step-1",
  templateUrl: "create-course-step-1.component.html",
  styleUrls: ["create-course-step-1.component.scss"]
})
export class CreateCourseStep1Component {

  form = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60)
    ]],
    releasedAt: [new Date(), Validators.required],
    category: ['BEGINNER', Validators.required],
    courseType: ['premium', Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: ['', [Validators.required, Validators.minLength(3)]]
  });

  startDate = new Date(1990, 0, 1);
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const date = cellDate.getDate();
    if (view === 'month') {
      return (date === 1) ? 'highlight-date' : '';
    }
    return '';
  }

  constructor(private fb: UntypedFormBuilder) {
    this.form.valueChanges.pipe(debounceTime(1000))
      .subscribe(res=>console.table(res))
  }

  get courseTitle() {
    return this.form.controls['title'];
  }

}
