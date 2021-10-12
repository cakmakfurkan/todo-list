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

  deleteTask(task: Task) {
    this.todoService.deleteToDo(task._id).subscribe(
      (data) => {
        this.notifierService.notify('success', 'Deleted Successfully!');
        this.tasks = this.tasks.filter((t) => t._id !== task._id)
      },
      (err) => {
        if(err.status === 401) {
          this.notifierService.notify('error', 'Please Login!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else if(err.status === 403) {
          this.notifierService.notify('error', 'Task not Found!');
        } else {
          this.notifierService.notify('error', `Something went wrong! Error: ${err.statusText}`);
        }
      }
    )
  }

  toggleReminder(task: Task) {
    task.isRemind = !task.isRemind;
    this.todoService.updateToDo(task).subscribe(
      (data) => {
        this.notifierService.notify('success', 'Updated Successfully!');
      },
      (err) => {
        task.isRemind = !task.isRemind;
        if(err.status === 401) {
          this.notifierService.notify('error', 'Please Login!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else if(err.status === 403) {
          this.notifierService.notify('error', 'Task not Found!');
        } else {
          this.notifierService.notify('error', `Something went wrong! Error: ${err.statusText}`);
        }
      }
    );
  }
}
