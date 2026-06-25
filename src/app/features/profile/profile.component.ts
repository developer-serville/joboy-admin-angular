import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  profileImage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private profileService: AuthService
  ) { }

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      email: [''],
      mobile: [''],
      role: [''],
      bio: ['']
    });

    this.loadProfile();
  }

  loadProfile(): void {

    this.profileService
      .getProfile()
      .subscribe(profile => {

        if (profile) {
          console.log(profile);

          this.profileImage = profile.image;

          this.profileForm.patchValue({
            firstname: profile.firstname,
            lastname: profile.lastname,
            email: profile.email,
            mobile: profile.mobile,
            role: profile.role
          });
        }
      });
  }

  updateProfile(): void {

    this.loading = true;

    const formValue = this.profileForm.value;

    this.profileService
      .updateProfile(
        formValue.firstname,
        formValue.lastname,
        formValue.email,
        formValue.mobile
      )
      .subscribe({
        next: () => {
          this.loading = false;
          this.loadProfile();
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}
