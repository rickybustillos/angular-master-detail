import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './components/page-header/page-header.component';

@NgModule({
  declarations: [
    BreadCrumbComponent,
    PageHeaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    // Shared modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    
    // Shared components
    BreadCrumbComponent,
    PageHeaderComponent
  ]
})
export class SharedModule { }
