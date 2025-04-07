import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { NotificationService } from './notification.service';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  phone?: string;
  department?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8080/api/students';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl).pipe(
      catchError(error => {
        this.notificationService.showError('Error al cargar los estudiantes');
        throw error;
      })
    );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showError(`Error al cargar el estudiante con ID ${id}`);
        throw error;
      })
    );
  }

  searchStudents(query: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/search?query=${query}`).pipe(
      catchError(error => {
        this.notificationService.showError(`Error al buscar estudiantes con el término "${query}"`);
        throw error;
      })
    );
  }

  createStudent(studentData: any): Observable<any> {
    return this.http.post(this.apiUrl, studentData).pipe(
      tap(() => {
        this.notificationService.showSuccess(`El estudiante ${studentData.firstName} ${studentData.lastName} ha sido creado exitosamente`);
      }),
      catchError(error => {
        this.notificationService.showError('Error al crear el estudiante');
        throw error;
      })
    );
  }

  updateStudent(id: number, studentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, studentData).pipe(
      tap(() => {
        this.notificationService.showSuccess(`El estudiante ${studentData.firstName} ${studentData.lastName} ha sido actualizado exitosamente`);
      }),
      catchError(error => {
        this.notificationService.showError('Error al actualizar el estudiante');
        throw error;
      })
    );
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.notificationService.showSuccess('El estudiante ha sido eliminado exitosamente');
      }),
      catchError(error => {
        this.notificationService.showError('Error al eliminar el estudiante');
        throw error;
      })
    );
  }
}