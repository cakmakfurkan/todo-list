import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../Task';
import { TodoService } from 'src/app/services/todo.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {
  @Input() task: Task;
  @Output() onDeleteTask: EventEmitter<Task> = new EventEmitter();
  @Output() onToggleReminder: EventEmitter<Task> = new EventEmitter();

  constructor(private todoService: TodoService, private router: Router, private notifierService: NotifierService) { 
    this.task = {
      _id: "",
      userID: "",
      task: "",
      date: new Date(),
      isRemind: false,
      createdAt: new Date()
    }
  }

  ngOnInit(): void {
  }

  onDelete(task: Task) {
    this.onDeleteTask.emit(task);
  }

  onToggle(task: Task) {
    this.onToggleReminder.emit(task);
  }
}
