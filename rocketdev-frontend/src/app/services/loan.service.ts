import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { NotificationService } from './notification.service';
import { Book } from './book.service';
import { Student } from './student.service';

export interface Loan {
  id: number;
  book: Book;
  student: Student;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://localhost:8080/api/loans';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl).pipe(
      catchError(error => {
        this.notificationService.showError('Error al cargar los préstamos');
        throw error;
      })
    );
  }

  getLoanById(id: number): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showError(`Error al cargar el préstamo con ID ${id}`);
        throw error;
      })
    );
  }

  getLoansByStudent(studentId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/student/${studentId}`).pipe(
      catchError(error => {
        this.notificationService.showError(`Error al cargar los préstamos del estudiante`);
        throw error;
      })
    );
  }

  getLoansByBook(bookId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/book/${bookId}`).pipe(
      catchError(error => {
        this.notificationService.showError(`Error al cargar los préstamos del libro`);
        throw error;
      })
    );
  }

  getActiveLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/active`).pipe(
      catchError(error => {
        this.notificationService.showError('Error al cargar los préstamos activos');
        throw error;
      })
    );
  }

  getOverdueLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/overdue`).pipe(
      catchError(error => {
        this.notificationService.showError('Error al cargar los préstamos vencidos');
        throw error;
      })
    );
  }

  createLoan(loanData: any): Observable<any> {
    return this.http.post(this.apiUrl, loanData).pipe(
      tap(() => {
        this.notificationService.showSuccess('El préstamo ha sido creado exitosamente');
      }),
      catchError(error => {
        this.notificationService.showError('Error al crear el préstamo');
        throw error;
      })
    );
  }

  returnBook(id: number, returnData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/return`, returnData).pipe(
      tap(() => {
        this.notificationService.showSuccess('El libro ha sido devuelto exitosamente');
      }),
      catchError(error => {
        this.notificationService.showError('Error al devolver el libro');
        throw error;
      })
    );
  }

  updateLoan(id: number, loanData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, loanData).pipe(
      tap(() => {
        this.notificationService.showSuccess('El préstamo ha sido actualizado exitosamente');
      }),
      catchError(error => {
        this.notificationService.showError('Error al actualizar el préstamo');
        throw error;
      })
    );
  }

  deleteLoan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.notificationService.showSuccess('El préstamo ha sido eliminado exitosamente');
      }),
      catchError(error => {
        this.notificationService.showError('Error al eliminar el préstamo');
        throw error;
      })
    );
  }
}