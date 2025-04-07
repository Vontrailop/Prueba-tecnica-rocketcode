import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService, Student } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="h3 mb-0"><i class="bi bi-people me-2"></i>Catálogo de Estudiantes</h2>
      </div>
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" placeholder="Buscar estudiantes..." (input)="onSearch($event)">
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="px-4">Número Estudiante</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Departamento</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of filteredStudents">
                <td class="px-4">{{student.studentNumber}}</td>
                <td>{{student.firstName}}</td>
                <td>{{student.lastName}}</td>
                <td>{{student.email}}</td>
                <td>{{student.department}}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary me-1" title="Editar" [routerLink]="['/students/edit', student.id]">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" title="Eliminar" (click)="deleteStudent(student.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredStudents.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox fs-4 d-block mb-2"></i>
                  No se encontraron estudiantes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table thead th {
      font-weight: 600;
      border-top: none;
    }
    .btn-sm {
      padding: 0.25rem 0.5rem;
    }
    .badge {
      font-weight: 500;
      padding: 0.5em 0.75em;
    }
  `]
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];

  constructor(
    private studentService: StudentService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.filteredStudents = students;
      },
      error: (error) => {
        console.error('Error detallado:', error);
      }
    });
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.firstName.toLowerCase().includes(searchTerm) ||
      student.lastName.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.studentNumber.toLowerCase().includes(searchTerm) ||
      (student.department && student.department.toLowerCase().includes(searchTerm))
    );
  }

  deleteStudent(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este estudiante?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error detallado:', error);
        }
      });
    } else {
      this.notificationService.showInfo('Operación cancelada');
    }
  }
}