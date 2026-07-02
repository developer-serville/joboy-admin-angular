import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { ConfirmOrderDialogComponent } from '../../components/confirm-order-dialog/confirm-order-dialog.component';
import { CustomerList } from '../../models/customer-list';
import { OrderCityList } from '../../models/order-city-list';
import { Order } from '../../models/order-list.model';
import { OrderServiceList } from '../../models/order-service-list.model';
import { OrderStatus } from '../../models/order-status.model';
import { ServiceProvider } from '../../models/service-provider-list.';
import { OrderFilter } from '../../service/order-filter.model';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule],
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
  activeActionMenu: string | null = null;
  providers: ServiceProvider[] = [];
  selectedProvider: number | null = null;

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

  actionMenus = [
    {
      title: 'Confirm',
      subtitle: 'Verify Booking',
      icon: 'check',
      color: 'green'
    },
    {
      title: 'Assign',
      subtitle: 'Set Specialist',
      icon: 'person_add',
      color: 'orange'
    },
    {
      title: 'Reassign',
      subtitle: 'Swap Personnel',
      icon: 'autorenew',
      color: 'purple'
    },
    {
      title: 'Reschedule',
      subtitle: 'Edit Schedule',
      icon: 'event',
      color: 'amber'
    },
    {
      title: 'In Progress',
      subtitle: 'Start Execution',
      icon: 'schedule',
      color: 'blue'
    },
    {
      title: 'Pause',
      subtitle: 'Halt Workflow',
      icon: 'pause',
      color: 'red'
    },
    {
      title: 'Resume',
      subtitle: 'Restart Job',
      icon: 'play_arrow',
      color: 'sky'
    },
    {
      title: 'Complete',
      subtitle: 'Finish Work',
      icon: 'task_alt',
      color: 'emerald'
    },
    {
      title: 'Invoiced',
      subtitle: 'Issue Invoice',
      icon: 'receipt_long',
      color: 'violet'
    },
    {
      title: 'Paid',
      subtitle: 'Settle Payment',
      icon: 'payments',
      color: 'pink'
    },
    {
      title: 'Cancel',
      subtitle: 'Void Booking',
      icon: 'cancel',
      color: 'rose'
    },
    {
      title: 'Close',
      subtitle: 'Archive Ticket',
      icon: 'lock',
      color: 'gray'
    }
  ];

  constructor(
    private orderService: OrderService,
    private websocketService: WebSocketService,
    private dialog: MatDialog

  ) { }


  ngOnInit(): void {
    // const userData = localStorage.getItem('userData');
    // if (userData) {
    //   const user = JSON.parse(userData);

    //   if (user?.token) {
    //     this.websocketService.connect(user.token);
    //   } else {
    //     console.error('Token not found in userData');
    //   }
    // }
    // this.websocketService.messages$.subscribe(message => {
    //   console.log('Socket Message =>', message);
    // });


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

  toggleActionMenu(orderNo: string): void {
    this.activeActionMenu =
      this.activeActionMenu === orderNo ? null : orderNo;
  }

  closeActionMenu(): void {
    this.activeActionMenu = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeActionMenu = null;
  }

  openConfirmDialog(order: Order): void {
    this.activeActionMenu = null;
    const dialogRef = this.dialog.open(ConfirmOrderDialogComponent, {
      width: '450px',
      disableClose: true,
      data: {
        action: 'confirm',
        order: order
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.orderService.confirmOrder(result).subscribe({
        next: () => {
          this.getOrders();
        },

        error: err => {
          console.error(err);
        }

      });

    });

  }

  openAssignDialog(order: Order): void {
    this.activeActionMenu = null;
    const dialogRef = this.dialog.open(ConfirmOrderDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        action: 'assign',
        order: order
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.orderService.assignOrder(result).subscribe({
        next: () => {
          this.getOrders();
        },
        error: err => {
          console.error(err);
        }
      });
    });

  }

  onActionClick(action: string, order: Order): void {

    switch (action) {

      case 'Confirm':
        this.openConfirmDialog(order);
        break;

      case 'Assign':
        this.openAssignDialog(order);
        break;

      case 'Reassign':
        // this.openReassignDialog(order);
        break;

      case 'In Progress':
        this.startInProgress(order);
        break;

      case 'Pause':
        this.pauseWork(order);
        break;

      case 'Resume':
        this.resumeWork(order);
        break;

      case 'Complete':
        this.completeWork(order);
        break;

      case 'Reschedule':
        // this.openRescheduleDialog(order);
        break;

      default:
        console.log(action);
        break;
    }

  }

  startInProgress(order: Order): void {
    this.activeActionMenu = null;
    const confirmed = window.confirm(
      `Are you sure you want to start the order #${order.order_no}?`
    );
    if (!confirmed) {
      return;
    }
    const payload = {
      order_req_id: order.order_id
    };
    this.orderService.startInProgress(payload).subscribe({
      next: () => {
        this.getOrders();
      },
      error: err => {
        console.error(err);

      }

    });

  }

  pauseWork(order: Order): void {
    this.activeActionMenu = null;
    const confirmed = window.confirm(
      `Are you sure you want to pause the work #${order.order_no}?`
    );
    if (!confirmed) {
      return;
    }
    const payload = {
      order_req_id: order.order_id
    };
    this.orderService.pauseWork(payload).subscribe({
      next: () => {
        this.getOrders();
      },
      error: err => {
        console.error(err);

      }

    });

  }

  resumeWork(order: Order): void {
    this.activeActionMenu = null;
    const confirmed = window.confirm(
      `Are you sure you want to resume the work #${order.order_no}?`
    );
    if (!confirmed) {
      return;
    }
    const payload = {
      order_req_id: order.order_id
    };
    this.orderService.resumeWork(payload).subscribe({
      next: () => {
        this.getOrders();
      },
      error: err => {
        console.error(err);

      }

    });

  }

  completeWork(order: Order): void {
    this.activeActionMenu = null;
    const confirmed = window.confirm(
      `Are you sure you want to complete the work #${order.order_no}?`
    );
    if (!confirmed) {
      return;
    }
    const payload = {
      order_req_id: order.order_id
    };
    this.orderService.completeWork(payload).subscribe({
      next: () => {
        this.getOrders();
      },
      error: err => {
        console.error(err);

      }

    });

  }
}