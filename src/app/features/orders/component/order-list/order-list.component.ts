import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { CustomerList } from '../../models/customer-list';
import { OrderCityList } from '../../models/order-city-list';
import { Order } from '../../models/order-list.model';
import { OrderServiceList } from '../../models/order-service-list.model';
import { OrderStatus } from '../../models/order-status.model';
import { OrderFilter } from '../../service/order-filter.model';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  imports: [CommonModule, FormsModule, MatIconModule],
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  loading = false;
  orders: Order[] = [];
  totalRecords = 0;
  totalPages = 0;
  visiblePages: number[] = [];
  readonly Math = Math;
  expandedOrderId: string | null = null;
  commentInputs: Partial<Record<number, string>> = {};
  statusTabs: OrderStatus[] = [];
  cityList: OrderCityList[] = [];
  serviceList: OrderServiceList[] = [];
  customerList: CustomerList[] = [];

  customerSearch = '';

  filter: OrderFilter = {
    page: 0,
    limit: 25,
    status: '',
    order_id: '',
    customer: '',
    from_date: '',
    to_date: '',
    city: null,
    cat_id: null,
    search: '',
    type: ''
  };

  queueMenus = [
    {
      title: 'All Bookings',
      value: '',
      icon: 'layers',
      count: 25
    },
    {
      title: 'Pending',
      value: '0',
      icon: 'schedule',
      count: 7
    },
    {
      title: 'In Progress',
      value: '1',
      icon: 'auto_fix_high',
      count: 7
    },
    {
      title: "Today's",
      value: '2',
      icon: 'calendar_today',
      count: 2
    },
    {
      title: 'Upcoming',
      value: '3',
      icon: 'event',
      count: 5
    },
    {
      title: 'Cancelled',
      value: '4',
      icon: 'cancel',
      count: 2
    },
    {
      title: 'For Review',
      value: '5',
      icon: 'shield',
      count: 9
    },
    {
      title: 'Follow Up',
      value: '6',
      icon: 'star_outline',
      count: 0
    }
  ];

  constructor(
    private orderService: OrderService,
    private websocketService: WebSocketService

  ) { }

  ngOnInit(): void {
    console.log('OrderListComponent ngOnInit');

    const userData = localStorage.getItem('userData');

    if (userData) {
      const user = JSON.parse(userData);

      if (user?.token) {
        this.websocketService.connect(user.token);
      } else {
        console.error('Token not found in userData');
      }
    }

    this.loadStatuses();
    this.loadCityList();
    this.getOrders();
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

  searchCustomer(): void {
    const keyword = this.customerSearch.trim();
    if (!keyword) {
      this.customerList = [];
      this.filter.customer = '';
      return;
    }
    this.orderService.getCustomerList(keyword).subscribe({
      next: (customers) => {
        this.customerList = customers;
      },
      error: err => console.error(err)
    });

  }

  selectCustomer(customer: CustomerList): void {
    this.customerSearch = customer.label;
    this.filter.customer = customer.user_id.toString();
    this.customerList = [];

  }

  loadServiceList(cityId: number): void {

    this.orderService.getServiceList(cityId).subscribe({
      next: (services) => {
        this.serviceList = [
          {
            id: -1,
            service: 'All Services'
          },
          ...services
        ];
      },
      error: err => console.error(err)
    });

  }

  onCityChange(): void {

    console.log('Selected city =>', this.filter.city);
    console.log('Type =>', typeof this.filter.city);

    this.filter.cat_id = null;

    if (this.filter.city == null || this.filter.city === -1) {
      this.serviceList = [];
      return;
    }

    this.loadServiceList(this.filter.city);
  }

  loadCityList() {
    this.orderService.getCityList().subscribe({
      next: (cities) => {

        console.log('Cities:', cities);

        this.cityList = [
          {
            city_id: -1,
            name: 'All City'
          },
          ...cities
        ];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadStatuses(): void {
    this.orderService.getOrderStatuses().subscribe({
      next: (statuses) => {
        this.statusTabs = [
          {
            id: -1,
            name: 'All Statuses'
          },
          ...statuses
        ];
      },
      error: (err) => {
        console.error(err);
      }
    });

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

  changeType(type: string): void {
    this.filter.type = type;
    this.filter.page = 0;
    this.getOrders();
  }

  searchOrders(): void {
    this.filter.page = 0;
    if (!this.filter.customer) {
      this.customerSearch = '';
    }
    console.log('Search Filter =>', this.filter);
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

  toggleComments(orderNo: string): void {
    this.expandedOrderId =
      this.expandedOrderId === orderNo ? null : orderNo;
  }

  saveComment(order: Order): void {

    const comment = this.commentInputs[order.order_id]?.trim();

    if (!comment) {
      return;
    }

    const payload = {
      order_id: order.order_id,
      comment: comment
    };

    this.orderService.addComment(payload).subscribe({

      next: (response: any) => {

        console.log('Comment added successfully', response);

        this.commentInputs[order.order_id] = '';

        this.getOrders();

        this.expandedOrderId = order.order_no;

      },

      error: (err) => {
        console.error(err);
      }

    });

  }
}