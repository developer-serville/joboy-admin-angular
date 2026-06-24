import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JoboyService {

  constructor() { }

  login(username: string, password: string) {

    if (
      (username === 'admin' ||
        username === 'george.jacob@serville.in') &&
      password === 'admin'
    ) {

      localStorage.setItem(
        'joboy_logged_in',
        'true'
      );

      return {
        success: true
      };
    }

    return {
      success: false,
      error: 'Invalid username or password'
    };
  }

  logout(): void {
    localStorage.removeItem(
      'joboy_logged_in'
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(
      'joboy_logged_in'
    ) === 'true';
  }
}