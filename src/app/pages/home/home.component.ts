import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // public olympics$: Observable<any> = of(null);
  public olympics$: Observable<Olympic[]> = of([]);
  public pieChartData: any[] = [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.updatePieChartData();
  }

  getTotalMedals(olympic: Olympic): number {
    return olympic.participations.reduce((total, participation) => {
      return total + participation.medalsCount;
    }, 0);
  }

  updatePieChartData(): void {
    this.olympics$.subscribe((olympics) => {
      this.pieChartData = olympics.map((olympic) => ({
        name: olympic.country,
        value: this.getTotalMedals(olympic),
      }));
    });
  }

}
