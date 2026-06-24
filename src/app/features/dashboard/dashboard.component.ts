import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  ChartConfiguration,
  ChartOptions,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
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
      color: '#3b3c3d'
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
      color: '#f59e0b'
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

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active En Route',
        data: [5, 8, 6, 11, 10, 4, 7],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59,130,246,0.12)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      },
      {
        label: 'Completed Tickets',
        data: [25, 32, 28, 42, 38, 22, 10],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: 'index',
      intersect: false
    },

    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          color: '#64748B',
          font: {
            size: 12,
            weight: 600
          }
        }
      },
      tooltip: {
        backgroundColor: '#0F172A',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },

    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E2E8F0'
        },
        ticks: {
          color: '#94A3B8',
          stepSize: 10,
          font: {
            size: 11
          }
        }
      }
    }
  };
}