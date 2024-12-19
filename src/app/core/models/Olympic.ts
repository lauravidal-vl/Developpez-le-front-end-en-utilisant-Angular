import { Participation } from './Participation';

export class Olympic {
  id: number;
  country: string;
  participations: Participation[];

  constructor(id: number, country: string, participations: Participation[]) {
    this.id = id;
    this.country = country;
    this.participations = participations;
  }

  getTotalMedals(): number {
    return this.participations?.reduce((total, participation) => total + participation.medalsCount, 0) || 0;
  }

  getTotalYears(): number {
    if (!this.participations || this.participations.length === 0) {
      return 0; // Retourne 0 si `participations` est vide ou indéfini
    }
    return new Set(this.participations.map((participation) => participation.year)).size;
  }

  getTotalAthletes(): number {
    return this.participations?.reduce((total, participation) => total + participation.athleteCount, 0) || 0;
  }
}
