import { Component, OnInit, inject } from '@angular/core';
import { YouthServiceService } from '../../../Services/YouthService/youth-service.service';
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-youth-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class YouthChartComponent implements OnInit {
  private youthService = inject(YouthServiceService);

  constructor() {
    // Register required Chart.js components
    Chart.register(
      PieController,
      ArcElement,
      Tooltip,
      Legend,
      BarController,
      CategoryScale,
      LinearScale,
      BarElement
    );
  }

  ngOnInit() {
    this.youthService.getAllYouth().subscribe((youths) => {
      // Gender Distribution for Pie Chart
      const genderData = this.getGenderDistribution(youths);

      // Education Level Distribution for Pie Chart
      const educationData = this.getEducationDistribution(youths);

      // Age Distribution for Bar Chart
      const ageData = this.getAgeDistribution(youths);

      // Create Pie Chart for Gender Distribution
      this.createPieChart('genderChart', {
        labels: Object.keys(genderData),
        datasets: [
          {
            label: 'Gender Distribution',
            data: Object.values(genderData),
            backgroundColor: ['#FF6384', '#36A2EB'],
          },
        ],
      });

      // Create Pie Chart for Education Level Distribution
      this.createPieChart('educationChart', {
        labels: Object.keys(educationData),
        datasets: [
          {
            label: 'Education Level Distribution',
            data: Object.values(educationData),
            backgroundColor: ['#4BC0C0', '#FFCE56', '#9966FF'],
          },
        ],
      });

      // Create Bar Chart for Age Distribution
      this.createBarChart('ageChart', {
        labels: Object.keys(ageData),
        datasets: [
          {
            label: 'Age Distribution',
            data: Object.values(ageData),
            backgroundColor: '#36A2EB',
          },
        ],
      });
    });
  }

  private getGenderDistribution(youths: any[]): Record<string, number> {
    return youths.reduce((acc, youth) => {
      acc[youth.gender] = (acc[youth.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getEducationDistribution(youths: any[]): Record<string, number> {
    return youths.reduce((acc, youth) => {
      acc[youth.educationLevel] = (acc[youth.educationLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getAgeDistribution(youths: any[]): Record<string, number> {
    const currentYear = new Date().getFullYear();
    return youths.reduce((acc, youth) => {
      const birthYear = new Date(youth.dob).getFullYear(); // Assuming `dob` is the date of birth
      const age = currentYear - birthYear;
      const ageGroup = this.getAgeGroup(age); // Get age group (e.g., 18-20, 21-23, etc.)
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getAgeGroup(age: number): string {
    const lowerLimit = Math.floor(age / 2) * 2; // Round down to nearest even number
    const upperLimit = lowerLimit + 2; // Set upper limit for 2-year range
    return `${lowerLimit}-${upperLimit}`;
  }

  private createPieChart(canvasId: string, chartData: any) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie', // Use 'pie' type for gender and education distribution
      data: chartData,
    });
  }

  private createBarChart(canvasId: string, chartData: any) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar', // Use 'bar' type for age distribution
      data: chartData,
    });
  }
}
