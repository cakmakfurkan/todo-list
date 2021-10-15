import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../Task';
@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {
  @Input() task: Task;
  @Output() onDeleteTask: EventEmitter<Task> = new EventEmitter();
  @Output() onToggleReminder: EventEmitter<Task> = new EventEmitter();
  @Output() formattedDate: string = '';

  constructor() {
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
  ngOnChanges(): void {
    this.formattedDate = new Date(this.task.date).toUTCString();
  }

  onDelete(task: Task) {
    this.onDeleteTask.emit(task);
  }

  onToggle(task: Task) {
    this.onToggleReminder.emit(task);
  }
}
