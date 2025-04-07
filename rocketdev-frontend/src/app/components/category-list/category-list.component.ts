import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Importamos Bootstrap para poder usar los modales
declare var bootstrap: any;

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="h3 mb-0"><i class="bi bi-tags me-2"></i>Categorías de Libros</h2>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" (click)="showAddCategoryModal()">
          <i class="bi bi-plus-circle me-1"></i>Nueva Categoría
        </button>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="px-4">Nombre</th>
                <th>Descripción</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let category of categories">
                <td class="px-4">{{category.genreName}}</td>
                <td>{{category.description || 'Sin descripción'}}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary me-1" title="Editar" (click)="editCategory(category)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" title="Eliminar" (click)="deleteCategory(category.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="categories.length === 0">
                <td colspan="3" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox fs-4 d-block mb-2"></i>
                  No se encontraron categorías
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar categoría -->
    <div class="modal fade" id="categoryModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Editar' : 'Nueva' }} Categoría</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="categoryForm">
              <div class="mb-3">
                <label for="genreName" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="genreName" formControlName="genreName">
                <div *ngIf="categoryForm.get('genreName')?.invalid && (categoryForm.get('genreName')?.dirty || categoryForm.get('genreName')?.touched)">
                  <small class="text-danger">El nombre es requerido</small>
                </div>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Descripción</label>
                <textarea class="form-control" id="description" rows="3" formControlName="description"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" [disabled]="!categoryForm.valid" (click)="saveCategory()">
              {{ isEditing ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Eliminación</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>¿Está seguro que desea eliminar esta categoría? Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" (click)="confirmDelete()">Eliminar</button>
          </div>
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
  `]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isEditing = false;
  currentCategoryId?: number;
  private categoryModal: any;
  private deleteModal: any;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      genreName: ['', Validators.required],
      description: [''],
      status: ['ACTIVE']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.categoryModal = document.getElementById('categoryModal');
    this.deleteModal = document.getElementById('deleteModal');
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => console.error('Error al cargar categorías:', error)
    });
  }

  showAddCategoryModal(): void {
    this.isEditing = false;
    this.categoryForm.reset();
    const modal = new bootstrap.Modal(this.categoryModal);
    modal.show();
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.currentCategoryId = category.id;
    this.categoryForm.patchValue({
      genreName: category.genreName,
      description: category.description || '',
      status: category.status || 'ACTIVE'
    });
    const modal = new bootstrap.Modal(this.categoryModal);
    modal.show();
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      
      if (this.isEditing && this.currentCategoryId) {
        this.categoryService.updateCategory(this.currentCategoryId, categoryData).subscribe({
          next: () => {
            this.loadCategories();
            const modal = bootstrap.Modal.getInstance(this.categoryModal);
            modal?.hide();
          },
          error: (error) => console.error('Error al actualizar categoría:', error)
        });
      } else {
        this.categoryService.createCategory(categoryData).subscribe({
          next: () => {
            this.loadCategories();
            const modal = bootstrap.Modal.getInstance(this.categoryModal);
            modal?.hide();
          },
          error: (error) => console.error('Error al crear categoría:', error)
        });
      }
    }
  }

  deleteCategory(id: number): void {
    this.currentCategoryId = id;
    const modal = new bootstrap.Modal(this.deleteModal);
    modal.show();
  }

  confirmDelete(): void {
    if (this.currentCategoryId) {
      this.categoryService.deleteCategory(this.currentCategoryId).subscribe({
        next: () => {
          this.loadCategories();
          const modal = bootstrap.Modal.getInstance(this.deleteModal);
          modal?.hide();
        },
        error: (error) => console.error('Error al eliminar categoría:', error)
      });
    }
  }
}