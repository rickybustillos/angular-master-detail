import { Directive, OnInit } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  public resources: T[] = [];

  constructor(private resourceService: BaseResourceService<T>) { }

  ngOnInit(): void {
    this.resourceService.getAll().subscribe(
      resources => this.resources = resources,
      error => alert('Erro ao carregar a lista')
    );
  }

  deleteResource(resource: T) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.resourceService.delete(Number(resource.id)).subscribe(
        () => this.resources = this.resources.filter(element => element != resource)),
        () => alert("Erro ao tentar excluir")
    }
  }

}
