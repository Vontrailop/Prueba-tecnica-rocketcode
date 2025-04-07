import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { BookService, Book } from '../../services/book.service';
import { StudentService, Student } from '../../services/student.service';

@Component({
  selector: 'app-loan-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="h3 mb-0"><i class="bi bi-journal-plus me-2"></i>Registrar Nuevo Préstamo</h2>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <form [formGroup]="loanForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="student" class="form-label">Estudiante</label>
                <select id="student" formControlName="studentId" class="form-select">
                  <option value="">Seleccionar estudiante</option>
                  <option *ngFor="let student of students" [value]="student.id">
                    {{student.firstName}} {{student.lastName}} ({{student.studentNumber}})
                  </option>
                </select>
                <div *ngIf="loanForm.get('studentId')?.invalid && (loanForm.get('studentId')?.dirty || loanForm.get('studentId')?.touched)">
                  <small class="text-danger">Debe seleccionar un estudiante</small>
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="book" class="form-label">Libro</label>
                <select id="book" formControlName="bookId" class="form-select">
                  <option value="">Seleccionar libro</option>
                  <option *ngFor="let book of availableBooks" [value]="book.id">
                    {{book.title}} - {{book.author}}
                  </option>
                </select>
                <div *ngIf="loanForm.get('bookId')?.invalid && (loanForm.get('bookId')?.dirty || loanForm.get('bookId')?.touched)">
                  <small class="text-danger">Debe seleccionar un libro</small>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="loanDate" class="form-label">Fecha de Préstamo</label>
                <input type="date" id="loanDate" formControlName="loanDate" class="form-control">
                <div *ngIf="loanForm.get('loanDate')?.invalid && (loanForm.get('loanDate')?.dirty || loanForm.get('loanDate')?.touched)">
                  <small class="text-danger">La fecha de préstamo es requerida</small>
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="dueDate" class="form-label">Fecha de Devolución</label>
                <input type="date" id="dueDate" formControlName="dueDate" class="form-control">
                <div *ngIf="loanForm.get('dueDate')?.invalid && (loanForm.get('dueDate')?.dirty || loanForm.get('dueDate')?.touched)">
                  <small class="text-danger">La fecha de devolución es requerida</small>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="notes" class="form-label">Notas</label>
              <textarea id="notes" formControlName="notes" class="form-control" rows="3"></textarea>
            </div>

            <div class="d-flex justify-content-end mt-3">
              <button type="button" class="btn btn-outline-secondary me-2" routerLink="/loans">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="!loanForm.valid">Registrar Préstamo</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-label {
      font-weight: 500;
    }
  `]
})
export class LoanCreateComponent implements OnInit {
  loanForm!: FormGroup;
  students: Student[] = [];
  books: Book[] = [];
  availableBooks: Book[] = [];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private bookService: BookService,
    private studentService: StudentService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadBooks();
  }

  createForm() {
    this.loanForm = this.fb.group({
      studentId: ['', Validators.required],
      bookId: ['', Validators.required],
      loanDate: [this.formatDate(new Date()), Validators.required],
      dueDate: [this.formatDate(this.getDefaultDueDate()), Validators.required],
      notes: ['']
    });
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => console.error('Error al cargar estudiantes:', error)
    });
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.availableBooks = books.filter(book => book.status === 'AVAILABLE' && book.quantity > 0);
      },
      error: (error) => console.error('Error al cargar libros:', error)
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  getDefaultDueDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 2 semanas por defecto
    return date;
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const loanData = {
        studentId: this.loanForm.value.studentId,
        bookId: this.loanForm.value.bookId,
        loanDate: this.loanForm.value.loanDate,
        dueDate: this.loanForm.value.dueDate,
        notes: this.loanForm.value.notes,
        status: 'ACTIVE'
      };

      this.loanService.createLoan(loanData).subscribe({
        next: (response) => {
          console.log('Préstamo registrado exitosamente', response);
          this.router.navigate(['/loans']);
        },
        error: (error) => {
          console.error('Error al registrar préstamo', error);
        }
      });
    }
  }
}