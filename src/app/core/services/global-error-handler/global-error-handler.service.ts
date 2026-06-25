import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';

export interface HttpErrorResponseModel {
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService {

  constructor(private matSnackBar: MatSnackBar) { }

  handleError(error: HttpErrorResponse, showSnackBar: boolean = true): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again.';
    let status = error.status || 500;

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else {
      switch (status) {
        case 0:
          errorMessage = 'Network error. Check your connection.';
          break;
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'User session expired. Please log in again.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try later.';
          break;
      }
    }

    if (showSnackBar) {
      this.showSnackBar(errorMessage);
    }

    const apiError: HttpErrorResponseModel = { message: errorMessage, status };

    return throwError(() => apiError);
  }

  private showSnackBar(message: string, duration: number = 3000): void {
    this.matSnackBar.open(message, 'Dismiss', {
      duration,
    });
  }

}
