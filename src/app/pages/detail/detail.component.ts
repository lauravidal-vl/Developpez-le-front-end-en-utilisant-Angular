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
  public olympic$!: Observable<Olympic | undefined>;

  constructor(private olympicService: OlympicService,
    private route:ActivatedRoute) {}

  ngOnInit(): void {
    const countryId = Number(this.route.snapshot.params['id']);
    this.olympic$ = this.olympicService.getCountryById(countryId);
    this.olympic$.subscribe((data) => {
      console.log('Data received:', data);
    });
  }

}
