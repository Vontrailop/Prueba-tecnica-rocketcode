import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { NotificationService } from './notification.service';

export interface Category {
  id: number;
  genreName: string;
  description?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(error => {
        this.notificationService.showError('Error al cargar las categorías');
        throw error;
      })
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showError(`Error al cargar la categoría con ID ${id}`);
        throw error;
      })
    );
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(this.apiUrl, categoryData).pipe(
      tap(() => {
        this.notificationService.showSuccess(`La categoría "${categoryData.genreName}" ha sido creada exitosamente`);
      }),
      catchError(error => {
        this.notificationService.showError('Error al crear la categoría');
        throw error;
      })
    );
  }

  updateCategory(id: number, categoryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoryData).pipe(
      tap(() => {
        this.notificationService.showSuccess(`La categoría "${categoryData.genreName}" ha sido actualizada exitosamente`);
      }),
      catchError(error => {
        this.notificationService.showError('Error al actualizar la categoría');
        throw error;
      })
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.notificationService.showSuccess('La categoría ha sido eliminada exitosamente');
      }),
      catchError(error => {
        this.notificationService.showError('Error al eliminar la categoría');
        throw error;
      })
    );
  }
}