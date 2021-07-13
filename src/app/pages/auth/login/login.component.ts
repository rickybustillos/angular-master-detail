import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../shared/user.model';

import * as toastr from 'toastr';
import { isInvalid, isValid } from 'src/app/helpers/form-control.hook';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public isInvalid = isInvalid;
  public isValid = isValid;

  public resourceForm!: FormGroup | any;
  public serverErrorMessages?: string[];
  public submittingForm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.buildResourceForm();
  }

  submitForm(): void {
    this.submittingForm = true;
    this.login();
  }

  private login(): void {
    const resource: User = this.resourceForm.value;

    this.authService.autenticate(resource)
      .subscribe(
        resource => this.actionsForSuccess(resource),
        error => this.actionsForError(error)
      )
  }

  protected actionsForSuccess(resource: User): void {
    toastr.success('Solicitação processada com sucesso!');

    // redirect
    this.router.navigateByUrl('/sistema')
  }

  protected actionsForError(error: any): void {
    toastr.error('Ocorreu um erro ao processar a sua solicitação.');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

  private buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(60), Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(120)]]
    });
  }

}
