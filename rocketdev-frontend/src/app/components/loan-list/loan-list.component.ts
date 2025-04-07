import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService, Loan } from '../../services/loan.service';

// Declaración para el objeto global bootstrap
declare var bootstrap: any;

@Component({
    selector: 'app-loan-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="h3 mb-0"><i class="bi bi-journal-arrow-up me-2"></i>Préstamos de Libros</h2>
      </div>
      <div class="col-md-6 text-end">
        <div class="btn-group">
          <button class="btn" [class.btn-primary]="activeFilter === 'all'" [class.btn-outline-primary]="activeFilter !== 'all'" (click)="filterLoans('all')">
            Todos
          </button>
          <button class="btn" [class.btn-primary]="activeFilter === 'active'" [class.btn-outline-primary]="activeFilter !== 'active'" (click)="filterLoans('active')">
            Activos
          </button>
          <button class="btn" [class.btn-primary]="activeFilter === 'overdue'" [class.btn-outline-primary]="activeFilter !== 'overdue'" (click)="filterLoans('overdue')">
            Vencidos
          </button>
          <button class="btn" [class.btn-primary]="activeFilter === 'returned'" [class.btn-outline-primary]="activeFilter !== 'returned'" (click)="filterLoans('returned')">
            Devueltos
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="px-4">Libro</th>
                <th>Estudiante</th>
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
                <th class="text-center">Estado</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let loan of filteredLoans">
                <td class="px-4">{{loan.book.title}}</td>
                <td>{{loan.student.firstName}} {{loan.student.lastName}}</td>
                <td>{{loan.loanDate | date:'dd/MM/yyyy'}}</td>
                <td>{{loan.dueDate | date:'dd/MM/yyyy'}}</td>
                <td class="text-center">
                  <span class="badge rounded-pill" [ngClass]="{
                    'bg-success': loan.status === 'ACTIVE' && !isOverdue(loan),
                    'bg-danger': loan.status === 'OVERDUE' || isOverdue(loan),
                    'bg-info': loan.status === 'RETURNED'
                  }">
                    {{loan.status === 'ACTIVE' && !isOverdue(loan) ? 'ACTIVO' : 
                      loan.status === 'RETURNED' ? 'DEVUELTO' : 
                      'VENCIDO'}}
                  </span>
                </td>
                <td class="text-center">
                  <button *ngIf="loan.status !== 'RETURNED'" class="btn btn-sm btn-outline-success me-1" title="Registrar Devolución" (click)="returnBook(loan.id)">
                    <i class="bi bi-check-circle"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-primary" title="Ver Detalles">
                    <i class="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredLoans.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox fs-4 d-block mb-2"></i>
                  No se encontraron préstamos
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para registrar devolución -->
    <div class="modal fade" id="returnModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registrar Devolución</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>¿Está seguro que desea registrar la devolución de este libro?</p>
            <div class="mb-3">
              <label for="returnNotes" class="form-label">Notas de devolución</label>
              <textarea class="form-control" id="returnNotes" rows="3" [(ngModel)]="returnNotes"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-success" (click)="confirmReturn()">Confirmar Devolución</button>
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
    .badge {
      font-weight: 500;
      padding: 0.5em 0.75em;
    }
  `]
})
export class LoanListComponent implements OnInit {
    loans: Loan[] = [];
    filteredLoans: Loan[] = [];
    activeFilter: 'all' | 'active' | 'overdue' | 'returned' = 'all';
    returnNotes: string = '';
    currentLoanId?: number;
    private modalElement: any;

    constructor(private loanService: LoanService) { }

    ngOnInit(): void {
        this.loadLoans();
    }

    ngAfterViewInit() {
        this.modalElement = document.getElementById('returnModal');
    }

    loadLoans(): void {
        this.loanService.getAllLoans().subscribe({
            next: (loans) => {
                this.loans = loans;
                this.applyFilter();
            },
            error: (error) => console.error('Error al cargar los préstamos:', error)
        });
    }

    filterLoans(filter: 'all' | 'active' | 'overdue' | 'returned'): void {
        this.activeFilter = filter;
        this.applyFilter();
    }

    applyFilter(): void {
        switch (this.activeFilter) {
            case 'active':
                this.filteredLoans = this.loans.filter(loan =>
                    loan.status === 'ACTIVE' && !this.isOverdue(loan)
                );
                break;
            case 'overdue':
                this.filteredLoans = this.loans.filter(loan =>
                    loan.status === 'OVERDUE' || this.isOverdue(loan)
                );
                break;
            case 'returned':
                this.filteredLoans = this.loans.filter(loan =>
                    loan.status === 'RETURNED'
                );
                break;
            default:
                this.filteredLoans = this.loans;
                break;
        }
    }

    isOverdue(loan: Loan): boolean {
        if (loan.status === 'RETURNED') return false;
        const today = new Date();
        const dueDate = new Date(loan.dueDate);
        return today > dueDate;
    }

    returnBook(loanId: number): void {
        this.currentLoanId = loanId;
        this.returnNotes = '';
        // Mostrar el modal usando Bootstrap
        const modal = new bootstrap.Modal(this.modalElement);
        modal.show();
    }

    confirmReturn(): void {
        if (!this.currentLoanId) return;

        const returnData = {
            returnDate: new Date(),
            notes: this.returnNotes
        };

        this.loanService.returnBook(this.currentLoanId, returnData).subscribe({
            next: () => {
                // Cerrar el modal y recargar los préstamos
                const modal = bootstrap.Modal.getInstance(this.modalElement);
                modal?.hide();
                this.loadLoans();
            },
            error: (error) => console.error('Error al registrar la devolución:', error)
        });
    }
}