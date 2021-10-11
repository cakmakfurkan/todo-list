import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  constructor(private todoService: TodoService, private router: Router, private authService: AuthService,  private notifierService: NotifierService) { }

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
}
