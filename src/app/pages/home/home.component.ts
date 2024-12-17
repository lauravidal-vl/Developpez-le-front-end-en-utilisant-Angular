import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
import { PieChart } from 'src/app/core/models/PieChart';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // @Input() olympic!: Olympic;

  public olympics$: Observable<Olympic[]> = of([]);
  public pieChartData!: PieChart[];
  public totalYears: number = 0;

  constructor(private olympicService: OlympicService,
              private router: Router) {}

  ngOnInit(): void {
    // Charger les données initiales
    this.olympicService.loadInitialData().subscribe();

    // S'abonner aux données olympiques
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((olympics) => {
      if (olympics) {
        this.updatePieChartData();
        this.totalYears = this.olympicService.getTotalYears(olympics[0]);
    }
    });
  }

  updatePieChartData(): void {
    this.olympics$.subscribe((olympics) => {
      this.pieChartData = olympics.map((olympic) => {
        return {
          id: olympic.id,
          name: olympic.country,
          value: this.olympicService.getTotalMedals(olympic),
        };
      });
    });
  }

    onSelect(event: {name: string}): void {
      const selectedCountry = this.pieChartData.find(
        (country) => country.name === event.name
      );
      if (selectedCountry) {
        this.router.navigate([`${selectedCountry.id}`]);
      }
    }
}
