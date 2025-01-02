import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription  } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { PieChart } from 'src/app/core/models/PieChart';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  // public olympics$: Observable<Olympic[]> = of([]);
  public olympics: Olympic[] = [];
  public pieChartData!: PieChart[];
  public totalYears: number = 0;

  constructor(private olympicService: OlympicService,
              private router: Router) {}

  ngOnInit(): void {

    const loadDataSub = this.olympicService.loadInitialData().subscribe();
    this.subscriptions.add(loadDataSub);

    const olympicsSub = this.olympicService.getOlympics().subscribe((olympics) => {
      if (olympics) {
        this.olympics = olympics;
        this.updatePieChartData();
        this.totalYears = olympics[0].getTotalYears();
    }
    });
    this.subscriptions.add(olympicsSub);
  }

  updatePieChartData(): void {
    this.pieChartData = this.olympics.map((olympic) => {
      return {
        id: olympic.id,
        name: olympic.country,
        value: olympic.getTotalMedals(),
      };
    });
  }

  /**
 * Gestion de la sélection d'un pays depuis le graphique
 * Lorsque l'utilisateur clique sur un pays redirige l'utilisateur vers la route détail du pays sélectionné
 *
 * @param event - l'événement contenant le nom du pays sélectionné
 */

  onSelect(event: {name: string}): void {
    const selectedCountry = this.pieChartData.find(
      (country) => country.name === event.name
    );
    if (selectedCountry) {
      this.router.navigate([`${selectedCountry.id}`]);
    }
  }

  ngOnDestroy(): void {
    // Désabonnement lors de la destruction du composant
    this.subscriptions.unsubscribe();
  }

}
