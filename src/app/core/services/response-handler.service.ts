import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponseModel } from './base-http.service';



@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  validateResponse<T>(
    response: HttpResponseModel<T>,
    showMessage = true
  ): T | null {

    if (response.status !== 'success') {

      if (showMessage) {
        this.showMessage(
          response.message || 'Unexpected error occurred.'
        );
      }

      return null;
    }

    if (showMessage && response.message) {
      this.showSuccessMessage(response.message);
    }

    return response.data ?? null;
  }

  showMessage(message: string): void {
    this.snackBar.open(message, '✕', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, '✕', {
      duration: 4000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
