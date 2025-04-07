import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService, Student } from '../../services/student.service';

@Component({
  selector: 'app-student-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="h3 mb-0"><i class="bi bi-person-gear me-2"></i>Editar Estudiante</h2>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando información del estudiante...</p>
          </div>

          <form *ngIf="!loading" [formGroup]="studentForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="firstName" class="form-label">Nombre</label>
                <input type="text" id="firstName" formControlName="firstName" class="form-control">
                <div *ngIf="studentForm.get('firstName')?.invalid && (studentForm.get('firstName')?.dirty || studentForm.get('firstName')?.touched)">
                  <small class="text-danger">El nombre es requerido</small>
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="lastName" class="form-label">Apellido</label>
                <input type="text" id="lastName" formControlName="lastName" class="form-control">
                <div *ngIf="studentForm.get('lastName')?.invalid && (studentForm.get('lastName')?.dirty || studentForm.get('lastName')?.touched)">
                  <small class="text-danger">El apellido es requerido</small>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" formControlName="email" class="form-control">
                <div *ngIf="studentForm.get('email')?.invalid && (studentForm.get('email')?.dirty || studentForm.get('email')?.touched)">
                  <small class="text-danger" *ngIf="studentForm.get('email')?.errors?.['required']">El email es requerido</small>
                  <small class="text-danger" *ngIf="studentForm.get('email')?.errors?.['email']">Ingrese un email válido</small>
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="studentNumber" class="form-label">Número de Estudiante</label>
                <input type="text" id="studentNumber" formControlName="studentNumber" class="form-control">
                <div *ngIf="studentForm.get('studentNumber')?.invalid && (studentForm.get('studentNumber')?.dirty || studentForm.get('studentNumber')?.touched)">
                  <small class="text-danger">El número de estudiante es requerido</small>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="phone" class="form-label">Teléfono</label>
                <input type="tel" id="phone" formControlName="phone" class="form-control">
              </div>

              <div class="col-md-6 mb-3">
                <label for="department" class="form-label">Departamento</label>
                <input type="text" id="department" formControlName="department" class="form-control">
              </div>
            </div>

            <div class="d-flex justify-content-end mt-3">
              <button type="button" class="btn btn-outline-secondary me-2" routerLink="/students">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="!studentForm.valid || submitting">
                <span *ngIf="submitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Guardar Cambios
              </button>
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
export class StudentEditComponent implements OnInit {
  studentForm!: FormGroup;
  studentId!: number;
  loading = true;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder, 
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.studentId = +this.route.snapshot.paramMap.get('id')!;
    this.loadStudent();
  }

  createForm() {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      studentNumber: ['', Validators.required],
      phone: [''],
      department: ['']
    });
  }

  loadStudent() {
    this.loading = true;
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          studentNumber: student.studentNumber,
          phone: student.phone,
          department: student.department
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar el estudiante', error);
        this.error = 'No se pudo cargar la información del estudiante';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.submitting = true;
      this.studentService.updateStudent(this.studentId, this.studentForm.value).subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: (error) => {
          console.error('Error al actualizar estudiante', error);
          this.error = 'No se pudo actualizar la información del estudiante';
          this.submitting = false;
        }
      });
    }
  }
}