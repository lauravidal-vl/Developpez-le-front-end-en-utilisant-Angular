import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  public olympics$!: Observable<Olympic | undefined>;
  public totalMedals: number = 0;  // Propriété pour stocker le total des médailles
  public totalAthletes: number = 0;  // Propriété pour stocker le total des athlètes
  public lineChartData: any[] = [];
  public lineChartLabels: string[] = [];  // Pour les années ou villes des participations


  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  timeline: boolean = true;

  constructor(private olympicService: OlympicService,
    private route:ActivatedRoute) {}

  ngOnInit(): void {
    const countryId = Number(this.route.snapshot.params['id']);

    this.olympics$ = this.olympicService.getCountryById(countryId);

        // Calculer le total des médailles à partir des données reçues
    this.olympics$.subscribe((data) => {
      if (data) {
        this.totalMedals = data.participations.reduce(
          (total, participation) => total + participation.medalsCount,
          0
        );
        this.totalAthletes = data.participations.reduce(
          (total, participation) => total + participation.athleteCount,
          0
        );
       // Préparer les données du graphique
       this.updateLineChartData(data);
      } else {
        this.totalMedals = 0;
        this.totalAthletes = 0;
      }
    });
  }

    // Méthode pour préparer les données du graphique
    updateLineChartData(olympic: Olympic): void {
      // Initialiser les labels (années ou villes des participations)
      this.lineChartLabels = olympic.participations.map(participation => participation.year.toString());

      // Initialiser les données du graphique : le nombre de médailles par participation
      this.lineChartData = [
        {
          name: 'Medals',
          series: olympic.participations.map(participation => ({
            name: participation.year.toString(),
            value: participation.medalsCount
          }))
        }
      ];
    }

}
