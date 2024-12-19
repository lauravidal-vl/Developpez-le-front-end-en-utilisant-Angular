import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Observable, of } from 'rxjs';
import { LineChart } from 'src/app/core/models/LineChart';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  public olympics$!: Observable<Olympic | undefined>;
  public totalMedals: number = 0;  // Propriété pour stocker le total des médailles
  public totalAthletes: number = 0;  // Propriété pour stocker le total des athlètes
  public lineChartData: LineChart[] = [];
  public lineChartView: [number, number] = [700, 400];


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

    // Charger les données initiales
    this.olympicService.loadInitialData().subscribe();

    // S'abonner aux données olympiques
    this.olympics$ = this.olympicService.getCountryById(countryId);
    this.olympics$.subscribe((olympics) => {
      if (olympics) {
        this.totalMedals = olympics.getTotalMedals();
        this.totalAthletes = olympics.getTotalAthletes();
       this.updateLineChartData(olympics);
      }
    });
    window.addEventListener('resize', () => this.updateChartView());
  }

  updateChartView() {
    const width = window.innerWidth;

    if (width < 768) {
      this.lineChartView = [300, 300]; // Dimensions pour les mobiles
    } else if (width < 1024) {
      this.lineChartView = [500, 350]; // Dimensions pour les tablettes
    } else {
      this.lineChartView = [700, 400]; // Dimensions par défaut pour les grands écrans
    }
  }

    // Méthode pour préparer les données du graphique
    updateLineChartData(olympic: Olympic): void {
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
