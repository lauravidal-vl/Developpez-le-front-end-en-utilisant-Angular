import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountryById(countryId: number): Observable<Olympic | undefined> {
    return this.getOlympics().pipe(
      map((olympics) => olympics.find((olympic) => olympic.id === countryId))
    );
  }

  getTotalMedals(olympic: Olympic): number {
      return olympic?.participations?.reduce((total, participation) => total + participation.medalsCount, 0) || 0;
  }

  getTotalYears(olympic: Olympic): number {
      return new Set(olympic?.participations?.map(participation => participation.year) || []).size;
  }

  getTotalAthletes(olympic: Olympic): number {
      return olympic?.participations?.reduce((total, participation) => total + participation.athleteCount, 0) || 0;
  }
}
