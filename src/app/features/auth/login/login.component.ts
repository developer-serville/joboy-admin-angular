import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { JoboyService } from '../../../services/joboy.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;

  loading = false;
  showPassword = false;

  error = '';

  forgotOpen = false;
  forgotSuccess = false;

  forgotEmail = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private joboyService: JoboyService
  ) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {

    this.error = '';

    if (this.loginForm.invalid) {
      this.error =
        'Please fill in both username and password.';
      return;
    }

    this.loading = true;

    setTimeout(() => {

      const result =
        this.joboyService.login(
          this.loginForm.value.username,
          this.loginForm.value.password
        );

      this.loading = false;

      if (result.success) {
        this.router.navigate(['/dashboard']);
      } else {
      }

    }, 600);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  autofill() {
    this.loginForm.patchValue({
      username: 'admin',
      password: 'admin'
    });
  }

  openForgot() {
    this.forgotOpen = true;
  }

  closeForgot() {
    this.forgotOpen = false;
    this.forgotSuccess = false;
  }

  sendReset() {

    if (!this.forgotEmail) {
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.forgotSuccess = true;
    }, 700);
  }
}