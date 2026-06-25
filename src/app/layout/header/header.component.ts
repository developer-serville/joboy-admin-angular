import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isDarkMode = true;
  showProfileMenu = false;

  userName = '';
  userEmail = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const theme = localStorage.getItem('theme');

    if (theme === 'light') {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    } else {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }

    const userData = localStorage.getItem('userData');

    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.name;
      this.userEmail = user.email;
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    this.authService.logout();
  }

  goToProfile(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/profile']);
  }
}