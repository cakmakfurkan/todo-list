import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';

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

  constructor(private authService: AuthServiceService) { }

  ngOnInit(): void { }

  loginProcess() {
    if(this.formGroup.valid) {
      console.log("aasda");
      this.authService.login(this.formGroup.value).subscribe({
        next(data) { console.log(data) },
        error(err) { console.log(err) }
      })
    }else {
      console.log("ccccc");
    }
  }
}
