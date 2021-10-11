import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

  constructor(private authService: AuthService, private router: Router, private notifierService: NotifierService) { }

  ngOnInit(): void {
  }

  signUpProcess() {
    if(this.formGroup.valid) {
      this.authService.signUp(this.formGroup.value).subscribe(
        (data: any) => { 
          this.notifierService.notify('success', 'Welcome!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        (err: any) => {
          this.notifierService.notify('error', `Something went wrong! Error: ${err.statusText}`);
        }
      )
    }
  }
}
