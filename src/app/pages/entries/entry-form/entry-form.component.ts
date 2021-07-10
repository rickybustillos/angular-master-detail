import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  public categories?: Array<Category>;

  public imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  constructor(
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected primeConfig: PrimeNGConfig,
    protected injector: Injector
  ) {
    super(injector, new Entry(), entryService, Entry.fromJson)
  }

  ngOnInit(): void {
    this.loadCategories();
    super.ngOnInit();
    this.primeConfig.setTranslation({
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
      monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
        'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      clear: 'Limpar'
    })
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return { 
          text: text,
          value: value
        }
      }
    )
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  protected creationPageTitle(): string {
    return 'Cadastro de novo lançamento';
  }

  protected EditionPageTitle(): string | any {
    const resourceName = this.resource.name || '';
    return `Editando lançamento: ${resourceName}`;
  }
}
