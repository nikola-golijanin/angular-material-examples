import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize} from 'rxjs/operators';
import {merge, fromEvent, throwError} from "rxjs";
import {Lesson} from "../model/lesson";
import {SelectionModel} from "@angular/cdk/collections";


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {

  course: Course;
  lessons: Lesson[];
  displayedColumns: string[] = ['select','seqNo', 'description', 'duration']
  loading: boolean = false;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort:MatSort;

  selection = new SelectionModel<Lesson>(true,[]);

  expandedLesson:Lesson = null

  constructor(private route: ActivatedRoute,
              private coursesService: CoursesService) {

  }

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];
    this.loadLessonsPage();
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(()=>this.paginator.pageIndex= 0)

    merge(this.sort.sortChange,this.paginator.page)
      .pipe(
      tap(()=>this.loadLessonsPage()))
      .subscribe()
  }

  loadLessonsPage() {
    this.loading = true;
    this.coursesService.findLessons(this.course.id,
      this.sort?.direction ?? "asc",
      this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? 3,
      this.sort?.active ?? "seqNo")
      .pipe(
        tap(lessons => this.lessons = lessons),
        catchError(err => {
          console.log("error loading lessons", err);
          alert("");
          return throwError(err);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe();
  }

  onToggleLesson(lesson:Lesson) {
    if(lesson == this.expandedLesson){
      this.expandedLesson = null;
      return;
    }

    this.expandedLesson = lesson;

  }

  onLessonSelected(lesson:Lesson) {
    this.selection.toggle(lesson)
  }

  isAllSelected(){
    return this.selection.selected?.length === this.lessons?.length
  }

  selectAll() {
    if(this.isAllSelected()){
      this.selection.clear();
      return;
    }

    this.selection.select(...this.lessons);
  }
}
