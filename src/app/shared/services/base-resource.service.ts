import { BaseResourceModel } from '../models/base-resource.model';

import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injector } from '@angular/core';


export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  constructor(protected apiPath: string, protected injector: Injector) {
    this.http = injector.get(HttpClient);
  }

  // Função para receber todos os dados do banco
  getAll(): Observable<T[]> {
    // Faz uma requisição GET para o path da API
    return this.http.get(this.apiPath).pipe(
      // Envia os erros para a variável handleError
      catchError(this.handleError),
      map(this.jsonDataToResources)
    )
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    )
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;

    return this.http.put(url, resource).pipe(
      catchError(this.handleError),
      // forçando a devolução do próprio objeto já que o in-memory-db não atualiza os dados
      map(() => resource)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  // protected methods
  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(element as T));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return jsonData as T;
  }

  protected handleError(error: any): Observable<any> {
    console.log("Erro na requisição: => ", error);
    return throwError(error);
  }

}