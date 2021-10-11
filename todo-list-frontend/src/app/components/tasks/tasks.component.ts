import { Component, OnInit } from '@angular/core';
import { Task } from '../../Task';
import { TodoService } from 'src/app/services/todo.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private todoService: TodoService, private router: Router, private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.todoService.getToDos().subscribe(
      (data) => {
        this.tasks = data.toDos;
      },
      (err) => {
        if(err.status === 401) {
          this.notifierService.notify('error', 'Please Login!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.notifierService.notify('error', `Something went wrong! Error: ${err.statusText}`);
        }
    });
  }

}
