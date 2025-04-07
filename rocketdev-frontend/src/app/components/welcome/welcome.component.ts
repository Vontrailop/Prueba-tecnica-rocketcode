import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService, Book } from '../../services/book.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
<div class="row mb-4">
      <div class="col-md-6">
        <h2 class="h3 mb-0"><i class="bi bi-book-half me-2"></i>Catálogo de Libros</h2>
      </div>
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" placeholder="Buscar libros..." (input)="onSearch($event)">
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="px-4">Título</th>
                <th>Autor</th>
                <th>ISBN</th>
                <th>Categoría</th>
                <th class="text-center">Cantidad</th>
                <th class="text-center">Estado</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let book of filteredBooks">
                <td class="px-4">{{book.title}}</td>
                <td>{{book.author}}</td>
                <td>{{book.isbn}}</td>
                <td>{{book.category?.genreName || 'Sin categoría'}}</td>
                <td class="text-center">{{book.quantity}}</td>
                <td class="text-center">
                  <span class="badge rounded-pill" [ngClass]="{
                    'bg-success': book.status === 'AVAILABLE',
                    'bg-warning text-dark': book.status === 'BORROWED',
                    'bg-danger': book.status === 'MAINTENANCE'
                  }">
                    {{book.status === 'AVAILABLE' ? 'DISPONIBLE' : 
                      book.status === 'BORROWED' ? 'PRESTADO' : 
                      book.status === 'MAINTENANCE' ? 'EN MANTENIMIENTO' : book.status}}
                  </span>
                </td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary me-1" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" title="Eliminar">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredBooks.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox fs-4 d-block mb-2"></i>
                  No se encontraron libros
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
export class WelcomeComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';

  constructor(
    private bookService: BookService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.filteredBooks = books;
        if (books.length === 0) {
          this.notificationService.showInfo('No hay libros disponibles en el catálogo');
        }
      },
      error: (error) => {
        console.error('Error detallado:', error);
      }
    });
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.isbn.toLowerCase().includes(searchTerm)
    );
  }
}