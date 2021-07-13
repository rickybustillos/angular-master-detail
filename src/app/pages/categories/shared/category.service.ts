import { Injectable, Injector } from '@angular/core';
import { Category } from './category.model';

import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { environment } from '../../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<Category> {
  constructor(protected injector: Injector) {
    super(`${environment.apiPath}/categories`, injector, Category.fromJson);
  }

}
