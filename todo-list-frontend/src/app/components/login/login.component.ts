import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  loginProcess() {
    if(this.formGroup.valid) {
      this.authService.login(this.formGroup.value).subscribe(
        (data: any) => { 
          console.log(data);
          this.router.navigate(['/todo']);
        },
        (err: any) => {
          if(err.status === 404 || err.status === 403) {
            alert('Username or Password are invalid');
          } else {
            alert(`Something went wrong! Error: ${err.statusText}`);
          }
        }
      )
    }
  }
}
