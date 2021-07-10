import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <span>
      {{errorMessage}}
    </span>
  `,
  styleUrls: ['./form-field-error.component.scss']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl?: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  public get errorMessage(): string | null {
    return this.getErrorMessage();
  }

  private getErrorMessage(): string | null {
    if(this.formControl?.errors?.required) {
      return 'Dado obrigatório';

    } else if(this.formControl?.errors?.email) {
      return 'Formato de email inválido.';

    } else if (this.formControl?.errors?.minlength) {
      const requiredLength = this.formControl.errors.minlength.requiredLength;
      return `Deve ter no mínimo ${requiredLength} caracteres.`;

    } else if (this.formControl?.errors?.maxlength) {
      const requiredLength = this.formControl.errors.maxlength.requiredLength;
      return `Deve ter no máximo ${requiredLength} caracteres.`;

    } else {
      return null;
    }
  }

}
