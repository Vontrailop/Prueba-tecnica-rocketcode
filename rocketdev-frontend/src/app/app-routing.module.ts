import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BookCreateComponent } from './components/book-create/book-create.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentCreateComponent } from './components/student-create/student-create.component';
import { StudentEditComponent } from './components/student-edit/student-edit.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanCreateComponent } from './components/loan-create/loan-create.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'books/create', component: BookCreateComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'students/create', component: StudentCreateComponent },
  { path: 'students/edit/:id', component: StudentEditComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'loans', component: LoanListComponent },
  { path: 'loans/create', component: LoanCreateComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
