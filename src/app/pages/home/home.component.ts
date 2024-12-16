import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { PieChart } from 'src/app/core/models/PieChart';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Input() olympic!: Olympic;

  public olympics$: Observable<Olympic[]> = of([]);
  public pieChartData!: PieChart[];
  public totalYears: number = 0;

  constructor(private olympicService: OlympicService,
    private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.updatePieChartData();
    this.olympics$.subscribe((olympics) => {
      if (olympics) {
        this.totalYears = this.getTotalYears(olympics[0]);
    }
    });
  }

  getTotalMedals(olympic: Olympic): number {
    return olympic.participations.reduce((total, participation) => {
      return total + participation.medalsCount;
    }, 0);
  }

  getTotalYears(olympic: Olympic): number {
    const uniqueYears = new Set(olympic.participations.map(participation => participation.year));
    return uniqueYears.size; // Retourne le nombre d'années uniques
  }


  updatePieChartData(): void {
    this.olympics$.subscribe((olympics) => {
      this.pieChartData = olympics.map((olympic) => {
        return {
          id: olympic.id,
          name: olympic.country,
          value: this.getTotalMedals(olympic),
        };
      });
    });
  }

      // Méthode appelée lors du clic sur un segment du graphique
    onSelect(event: {name: string}): void {
      // Trouver l'ID correspondant au pays sélectionné
      const selectedCountry = this.pieChartData.find(
        (country) => country.name === event.name
      );
      if (selectedCountry) {
        console.log('ID:', selectedCountry.id);  // Vous pouvez maintenant accéder à l'ID
        this.router.navigate([`${selectedCountry.id}`]);  // Naviguer vers la page de détail
      } else {
        console.log('Country not found!');
      }
    }



}
