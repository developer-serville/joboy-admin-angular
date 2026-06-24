import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  stats = [
    {
      title: 'UNASSIGNED TICKETS',
      value: 9,
      badge: 'Immediate Action',
      color: '#ef4444'
    },
    {
      title: 'IN PROGRESS',
      value: 7,
      badge: 'En Route',
      color: '#3b82f6'
    },
    {
      title: 'COMPLETED TODAY',
      value: 9,
      badge: 'Closed Success',
      color: '#10b981'
    },
    {
      title: 'SLA BREACH RISK',
      value: '28%',
      badge: '7 Delayed Tickets',
      color: '#d97706'
    }
  ];

  dispatchLogs = [
    {
      title: 'Status Change',
      user: 'Liam Carter (Provider)',
      message: 'Completed AC Repair service.'
    },
    {
      title: 'Service Started',
      user: 'Noah Brooks (Provider)',
      message: 'Provider started work onsite.'
    },
    {
      title: 'Order Placed',
      user: 'Alice Johnson (Customer)',
      message: 'New ticket raised.'
    },
    {
      title: 'Assigned Provider',
      user: 'George Jacob (Admin)',
      message: 'Provider assigned.'
    }
  ];

  tickets = [
    {
      id: 'JB-1001',
      client: 'John Doe',
      phone: '+1 (555) 901-2345',
      service: 'AC Repair',
      time: '10:00 AM - 12:00 PM',
      specialist: 'Liam Carter',
      amount: '$150',
      status: 'COMPLETED'
    },
    {
      id: 'JB-1002',
      client: 'Sarah Smith',
      phone: '+1 (555) 890-1234',
      service: 'House Cleaning',
      time: '02:00 PM - 05:00 PM',
      specialist: 'Noah Brooks',
      amount: '$120',
      status: 'IN PROGRESS'
    },
    {
      id: 'JB-1003',
      client: 'Alice Johnson',
      phone: '+1 (555) 789-0123',
      service: 'Plumbing Service',
      time: '09:00 AM - 11:00 AM',
      specialist: 'UNASSIGNED',
      amount: '$85',
      status: 'PENDING'
    },
    {
      id: 'JB-1004',
      client: 'Bob Wilson',
      phone: '+1 (555) 678-9012',
      service: 'Electrical Work',
      time: '01:00 PM - 03:00 PM',
      specialist: 'Mia Thompson',
      amount: '$320',
      status: 'COMPLETED'
    }
  ];

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active En Route',
        data: [5, 8, 6, 11, 10, 4, 7],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Completed Tickets',
        data: [25, 32, 28, 42, 38, 22, 10],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };
}
