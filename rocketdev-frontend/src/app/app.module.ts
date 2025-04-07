import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BookCreateComponent } from './components/book-create/book-create.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentCreateComponent } from './components/student-create/student-create.component';
import { StudentEditComponent } from './components/student-edit/student-edit.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanCreateComponent } from './components/loan-create/loan-create.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    }),
    RouterModule,
    AppComponent,
    WelcomeComponent,
    BookCreateComponent,
    StudentListComponent,
    StudentCreateComponent,
    StudentEditComponent,
    CategoryListComponent,
    LoanListComponent,
    LoanCreateComponent
  ],
  providers: []
})
export class AppModule { }
