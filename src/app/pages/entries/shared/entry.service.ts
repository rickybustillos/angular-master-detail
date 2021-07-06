import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';

import { CategoryService } from '../../categories/shared/category.service';

import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries"

  constructor(private http: HttpClient, private categoryService: CategoryService) { }

  // Função para receber todos os dados do banco
  public getAll(): Observable<Entry[]> {
    // Faz uma requisição GET para o path da API
    return this.http.get(this.apiPath).pipe(
      // Envia os erros para a variável handleError
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    )
  }

  public getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  public create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      // Sem o mergeMap iria retornar Observable<Observable<Entry>>
      mergeMap(category => {
        entry.category = category;

        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        )
      })
    )
  }

  public update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;

    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      // forçando a devolução do próprio objeto já que o in-memory-db não atualiza os dados
      map(() => entry)
    )
  }

  public delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }


  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];

    jsonData.forEach(element => entries.push(Object.assign(new Entry(), element)));

    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição: => ", error);
    return throwError(error);
  }
}
