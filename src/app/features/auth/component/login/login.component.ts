import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


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
export class LoginComponent implements OnInit {

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
    private authService: AuthService
  ) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
  }

  login() {

    this.error = '';

    if (this.loginForm.invalid) {
      this.error =
        'Please fill in both username and password.';
      return;
    }

    this.loading = true;

    this.authService
      .userSignIn(
        this.loginForm.value.username,
        this.loginForm.value.password
      )
      .subscribe({

        next: (response) => {

          this.loading = false;

          if (response) {
            this.router.navigate(['/dashboard']);
          } else {
            this.error = 'Invalid credentials';
          }
        },

        error: (error) => {

          this.loading = false;

          this.error =
            error.error?.message ||
            'Login failed.';
        }
      });
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