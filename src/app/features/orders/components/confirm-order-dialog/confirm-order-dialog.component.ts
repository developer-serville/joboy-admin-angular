import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ServiceProvider } from '../../models/service-provider-list.';
import { OrderService } from '../../service/order.service';


@Component({
  selector: 'app-confirm-order-dialog',
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './confirm-order-dialog.component.html',
  styleUrl: './confirm-order-dialog.component.scss'
})
export class ConfirmOrderDialogComponent implements OnInit {
  confirmReason = '';
  providers: ServiceProvider[] = [];
  selectedProvider: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ConfirmOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    if (this.data.action === 'assign') {
      this.loadProviders();
    }

  }

  loadProviders(): void {

    console.log('Dialog data:', this.data);
    console.log('Service ID:', this.data.order.service_id);

    this.orderService
      .getServiceProviderList(this.data.order.service_id)
      .subscribe({

        next: (res) => {
          console.log('Provider API Response:', res);
          this.providers = res;
        },

        error: (err) => {
          console.error('Provider API Error:', err);
        }

      });

  }

  save(): void {

    if (this.data.action === 'assign') {

      this.dialogRef.close({
        order_id: this.data.order.order_id,
        service_id: this.selectedProvider,
        comment: this.confirmReason
      });

    } else {

      this.dialogRef.close({
        order_id: this.data.order.order_id,
        confirm_reason: this.confirmReason
      });

    }

  }
}
