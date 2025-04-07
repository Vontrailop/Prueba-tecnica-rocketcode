import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CategoryService, Category } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-book-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {
  bookForm!: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder, 
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.createForm();
  }
  
  ngOnInit() {
    this.loadCategories();
  }
  
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => console.error('Error al cargar categorías:', error)
    });
  }

  createForm() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.bookService.createBook(this.bookForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error detallado:', error);
        }
      });
    } else {
      this.notificationService.showWarning('Por favor complete todos los campos requeridos');
      this.markFormGroupTouched(this.bookForm);
    }
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}