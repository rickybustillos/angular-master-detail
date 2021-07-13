import { BaseResourceModel } from '../models/base-resource.model';

import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injector } from '@angular/core';


export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;
  token?: string | any = '';
  private authService!: AuthService;

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T,
  ) {
    this.http = injector.get(HttpClient);
    this.authService = injector.get(AuthService);
  }
  
  
  getAll(): Observable<T[]> {
    this.token = this.authService.autenticated(true);
    return this.http.get(this.apiPath, { headers: {'Authorization': this.token} }).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResources.bind(this))
    )
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url, { headers: {'Authorization': this.token} }).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )

  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource, { headers: {'Authorization': this.token} }).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;

    return this.http.put(url, resource, { headers: {'Authorization': this.token} }).pipe(
      // forçando a devolução do próprio objeto já que o in-memory-db não atualiza os dados
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError),
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url, { headers: {'Authorization': this.token} }).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )
  }

  // protected methods
  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(
      element => resources.push(this.jsonDataToResourceFn(element))
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }

  protected handleError(error: any): Observable<any> {
    console.log("Erro na requisição: => ", error);
    return throwError(error);
  }

}