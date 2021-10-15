import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../Task';
import { EventProxyService } from '../../services/event-proxy.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService,  private notifierService: NotifierService, private dialog: MatDialog) { }

  ngOnInit(): void { }

  onLogout(): void {
    this.authService.logout().subscribe(
      (data) => {
        this.notifierService.notify('success', 'Logout Successfully!');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
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
      }
    )
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddToDoDialog, {
      width: '80%',
      data: {task: '', date: new Date(), isRemind: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ', result);
    });
  }
}

@Component({
  selector: 'add-todo-dialog',
  templateUrl: 'add-todo-dialog.html',
})
export class AddToDoDialog {

  constructor(
    public dialogRef: MatDialogRef<AddToDoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private todoService: TodoService,
    private notifierService: NotifierService,
    private eventProxyService: EventProxyService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateClick(): void {
    console.log(this.data);
    this.todoService.createToDo(this.data).subscribe(
      (data) => {
        this.notifierService.notify('success', 'Created Successfully!');
        this.eventProxyService.triggerSomeEvent('getTasks');
        this.dialogRef.close();
      },
      (err) => {
        this.notifierService.notify('error', `Something went wrong! Error: ${err.statusText}`);
      }
    )
  }

}