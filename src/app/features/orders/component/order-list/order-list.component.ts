import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../models/order-list,model';
import { OrderFilter } from '../../service/order-filter.model';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  imports: [CommonModule, FormsModule, MatIconModule],
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  loading = false;
  orders: Order[] = [];
  totalRecords = 0;
  totalPages = 0;
  visiblePages: number[] = [];
  readonly Math = Math;

  filter: OrderFilter = {
    page: 0,
    limit: 25,
    status: 25,
    order_id: '',
    customer: '',
    from_date: '',
    to_date: '',
    city: '0',
    cat_id: [],
    search: ''

  };

  statusTabs = [

    {
      title: 'All Booking Tickets',
      value: 25
    },

    {
      title: 'Pending',
      value: 0
    },

    {
      title: 'In Progress',
      value: 1
    },

    {
      title: 'Completed',
      value: 3
    },

    {
      title: 'Cancelled',
      value: 6
    }

  ];

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.loading = true;
    this.orderService.getOrders(this.filter).subscribe({
      next: (response: any) => {
        this.orders = response?.data ?? [];
        this.totalRecords = response?.recordsTotal ?? 0;
        this.totalPages = Math.ceil(this.totalRecords / this.filter.limit);
        this.updateVisiblePages();
        this.loading = false;
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
      }

    });

  }

  updateVisiblePages(): void {
    const maxVisible = 5;
    let start = Math.max(
      1,
      this.filter.page + 1 - Math.floor(maxVisible / 2)
    );

    let end = Math.min(
      this.totalPages,
      start + maxVisible - 1
    );

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    this.visiblePages = [];
    for (let i = start; i <= end; i++) {
      this.visiblePages.push(i);
    }
  }

  changeStatus(status: number) {
    this.filter.status = status;
    this.filter.page = 0
    this.getOrders();
  }

  searchOrders() {
    this.filter.page = 0;
    this.getOrders();
  }

  changeLimit() {
    this.filter.page = 0;
    this.getOrders();
  }

  nextPage(): void {
    if (this.filter.page < this.totalPages - 1) {
      this.filter.page++;
      this.updateVisiblePages();
      this.getOrders();
    }

  }

  previousPage(): void {
    if (this.filter.page > 0) {
      this.filter.page--;
      this.updateVisiblePages();
      this.getOrders();
    }

  }

  goToPage(page: number): void {
    this.filter.page = page - 1;
    this.updateVisiblePages();
    this.getOrders();
  }

  get endRecord(): number {

    return Math.min(
      (this.filter.page * this.filter.limit) + this.orders.length,
      this.totalRecords
    );

  }
}