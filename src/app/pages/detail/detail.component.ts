import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Observable, of, Subscription } from 'rxjs';
import { LineChart } from 'src/app/core/models/LineChart';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  public olympics$!: Observable<Olympic | undefined>;
  public olympics?: Olympic;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
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

    const loadDataSub = this.olympicService.loadInitialData().subscribe();
    this.subscriptions.add(loadDataSub);

    this.olympics$ = this.olympicService.getCountryById(countryId);

    const olympicsSub = this.olympics$.subscribe((olympics) => {
      if (olympics) {
        this.olympics = olympics;
        this.totalMedals = olympics.getTotalMedals();
        this.totalAthletes = olympics.getTotalAthletes();
        this.updateLineChartData(olympics);
      }
    });
    this.subscriptions.add(olympicsSub);

    // Gestion du redimensionnement
    const resizeListener = () => this.updateChartView();
    window.addEventListener('resize', resizeListener);
    this.subscriptions.add({
      unsubscribe: () => window.removeEventListener('resize', resizeListener)
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  updateLineChartData(olympic: Olympic): void {
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
