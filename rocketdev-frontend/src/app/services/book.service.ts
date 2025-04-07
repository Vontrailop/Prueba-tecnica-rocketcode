import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { NotificationService } from './notification.service';
import { Category } from './category.service';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  status: string;
  category?: Category;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      catchError(error => {
        this.notificationService.showError('Error al cargar los libros');
        throw error;
      })
    );
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showError(`Error al cargar el libro con ID ${id}`);
        throw error;
      })
    );
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search?query=${query}`).pipe(
      catchError(error => {
        this.notificationService.showError(`Error al buscar libros con el término "${query}"`);
        throw error;
      })
    );
  }

  createBook(bookData: any): Observable<any> {
    return this.http.post(this.apiUrl, bookData).pipe(
      tap(() => {
        this.notificationService.showSuccess(`El libro "${bookData.title}" ha sido creado exitosamente`);
      }),
      catchError(error => {
        this.notificationService.showError('Error al crear el libro');
        throw error;
      })
    );
  }

  updateBook(id: number, bookData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, bookData).pipe(
      tap(() => {
        this.notificationService.showSuccess(`El libro "${bookData.title}" ha sido actualizado exitosamente`);
      }),
      catchError(error => {
        this.notificationService.showError('Error al actualizar el libro');
        throw error;
      })
    );
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.notificationService.showSuccess('El libro ha sido eliminado exitosamente');
      }),
      catchError(error => {
        this.notificationService.showError('Error al eliminar el libro');
        throw error;
      })
    );
  }
}