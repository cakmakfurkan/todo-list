import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  
  constructor(private authService: AuthService, private router: Router, private notifierService: NotifierService) { }

  ngOnInit(): void { }

  loginProcess() {
    if(this.formGroup.valid) {
      this.authService.login(this.formGroup.value).subscribe(
        (data) => { 
          this.notifierService.notify('success', 'Welcome!');
          setTimeout(() => {
            this.router.navigate(['/todo']);
          }, 1500);
        },
        (err) => {
          if(err.status === 404 || err.status === 403) {
            this.notifierService.notify('error', 'Username or Password are invalid!');
          } else {
            this.notifierService.notify('error', `Something went wrong! Error: ${err.statusText}`);
          }
        }
      )
    }
  }
}
