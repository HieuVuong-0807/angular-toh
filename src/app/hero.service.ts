import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService, private http: HttpClient) { }

private heroesUrl: string = 'api/heroes';

httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'applicaton/json' })
};

  /*getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add("HeroService: fetched heroes");
    return heroes;
  }*/

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(tap( _ => this.log('fetched heroes')), catchError(this.handleError<Hero[]>('getHeroes, []')));
  }

  /*getHero(id: number): Observable<Hero> {
    const hero: Hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetch hero id = ${id}`);
    return of(hero);
  }*/

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(tap(_ => this.log(`fetched Hero: ${id}`), catchError(this.handleError<Hero>(`getHero id=${id}`))));
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    console.error(error);
    this.log(`${operation} failed: ${error.message}`);
    return of(result as T);
  }
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(tap(_ => this.log(`Updated hero id=${hero.id}`), catchError(this.handleError<any>('updateHero'))));

  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(tap((newHero: Hero) => this.log(`Added new hero with id=${newHero.id}`)), catchError(this.handleError<Hero>('addHero')));
  }

  deleteHero(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete(url, this.httpOptions).pipe(tap(_ => this.log(`Delete Hero id=${id}`), catchError(this.handleError<Hero>('delete Hero'))));
  }

  searchHero(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(tap(x => x.length? this.log(`Found heroes matching: "${term}"`): this.log(`No heroes matching "${term}"`), catchError(this.handleError<Hero[]>('searchHeroes', []))));

  }

}
