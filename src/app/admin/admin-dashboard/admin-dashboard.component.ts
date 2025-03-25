import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../service/device.service';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';
import { UserService } from '../../service/user.service';
import { LeaveRequestService } from '../../service/leave-request.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{
  statistics: any = {};
  userStats: any = {};
  leaveStats: any = {};
  deviceChart: any;
  userChart: any;
  leaveChart: any;

  constructor(
    private deviceService: DeviceService,
    private userService: UserService,
    private leaveService: LeaveRequestService
  ) {
    Chart.register(...registerables);// 🔥 Đăng ký các thành phần của Chart.js
  }

  ngOnInit(): void {
    this.deviceService.getDeviceStatistics().subscribe((data) => {
      this.statistics = data;
      this.createDeviceChart();
    });

    this.userService.getUserStatistics().subscribe((data) => {
      this.userStats = data; // 🔥 Đúng biến `this.userStats`
      this.createUserChart();
    });

    this.leaveService.getLeaveStatistics().subscribe((data) => {
      this.leaveStats = data; // 🔥 Đúng biến `this.userStats`
      this.createLeaveChart();
    });
  }

  createDeviceChart() {
    if (this.deviceChart) {
      this.deviceChart.destroy();
    }

    this.deviceChart = new Chart('deviceChart', {
      type: 'doughnut',
      data: {
        labels: ['Đang hoạt động', 'Không hoạt động'],
        datasets: [
          {
            data: [
              this.statistics.activeDevices || 0,
              this.statistics.inactiveDevices || 0
            ],
            backgroundColor: ['#2196f3', '#f44336']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  createUserChart() {
    if (this.userChart) {
      this.userChart.destroy();
    }

    this.userChart = new Chart('userChart', {
      type: 'pie',
      data: {
        labels: ['Tổng User', 'Tổng Admin'],
        datasets: [
          {
            data: [this.userStats.Users || 0, this.userStats.Admin || 0],
            backgroundColor: ['#42A5F5', '#FF6384']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  createLeaveChart(){
    if(this.leaveChart){
      this.leaveChart.destroy();
    }
    this.leaveChart = new Chart('leaveChart', {
      type: 'bar',
      data: {
        labels: ['Da Duyet', 'Tu choi', 'Dang cho duyet'],
        datasets: [
          {       
            data: [
              this.leaveStats.Approved || 0,
              this.leaveStats.Rejected || 0,
              this.leaveStats.Pending || 0
            ],            
            backgroundColor: ['#4CAF50', '#F44336', '#FF9800']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}
