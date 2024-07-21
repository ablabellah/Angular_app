<header>
    <h1>Dashboard</h1>
  </header>
  <nav>
    <ul>
      <li><a (click)="add_dos()">Ajouter un Dossier</a></li>
      <li><a (click)="add_doc()">Ajouter un Document</a></li>
      <li><a (click)="refresh()">Refresh</a></li>
    </ul>
  </nav>
  <section>
    <h2 style="font-size: x-large;">List des Dossiers :</h2>
<table>
  <tr *ngFor="let dossier of dossiers">
    <td><input type="text" [(ngModel)]="dossier.name" [disabled]="editingdossier !== dossier"></td>
    <td><input type="text" [(ngModel)]="dossier.proprietaire" disabled></td>
    <td>
      <ng-container *ngIf="editingdossier === dossier">
        <button class="save" (click)="savedossierChanges()">Save</button>
        <button class="cancel" (click)="cancelEdit()">Cancel</button>
      </ng-container>
      <ng-container *ngIf="editingdossier !== dossier">
        <button class="edit" (click)="editdossier(dossier)">Edit</button>
        <button class="add-doc" (click)="addDocumentToDossier(dossier)">Ajouter un document</button>
      </ng-container>
    </td>
  </tr>
</table>

<h2 style="font-size: x-large;">List des Documents :</h2>
<table>
  <tr *ngFor="let document of documents">
    <td><input type="text" [(ngModel)]="document.name" [disabled]="editingdocument !== document"></td>
    <td><input type="text" [(ngModel)]="document.emplacement" disabled></td>
    <td><input type="text" [(ngModel)]="document.extension" [disabled]="editingdocument !== document"></td>
    <td><input type="text" [(ngModel)]="document.type" [disabled]="editingdocument !== document"></td>
    <td><input type="text" [(ngModel)]="document.taille" [disabled]="editingdocument !== document"></td>
    <td><input type="text" [(ngModel)]="document.proprietaire" disabled></td>
    <td>
      <ng-container *ngIf="editingdocument === document">
        <button class="save" (click)="savedocumentChanges()">Save</button>
        <button class="cancel" (click)="cancelEdit()">Cancel</button>
      </ng-container>
      <ng-container *ngIf="editingdocument !== document">
        <button class="edit" (click)="editdocument(document)">Edit</button>
      </ng-container>
    </td>
  </tr>
</table>
  </section>






  import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GestiondocumentComponent } from '../gestiondocument/gestiondocument.component';
import { GestiondossierComponent } from '../gestiondossier/gestiondossier.component';
import { DossierService } from '../dossier.service';
import { AuthService } from '../auth.service';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  dossiers: any[] = [];
  documents: any[] = [];
  editingdossier: any = null;
  editingdocument: any = null;

  constructor(
    private dialog: MatDialog,
    private dossierService: DossierService,
    private documentService: DocumentService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.refresh();
  }
  editdossier(document: any) {
    this.editingdossier = document;
  }

  savedossierChanges() {
    this.dossierService.updateDossier(this.editingdossier).subscribe({
      next: updatedDossier => {
        console.log('Document updated successfully:', updatedDossier);
        this.loadDossiers();
        this.editingdossier = null;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  cancelEdit() {
    this.editingdossier = null;
    this.editingdocument = null;
  }

  loadDossiers(): void {
    this.dossierService.getDossiers(this.auth.getCurrentUsername()).subscribe({
      next: (documents: any[]) => {
        this.dossiers = documents;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
      }
    });
  }

  loadDocuments(dossierId?: string): void {
    this.documentService.getDocuments(this.auth.getCurrentUsername(), dossierId).subscribe({
      next: (documents: any[]) => {
        this.documents = documents;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
      }
    });
  }

  savedocumentChanges() {
    this.documentService.updateDocument(this.editingdocument).subscribe({
      next: updatedDocument => {
        console.log('Document updated successfully:', updatedDocument);
        this.loadDocuments(this.editingdocument.dossierId); // Utilisez l'ID du dossier approprié.
        this.editingdocument = null;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  editdocument(document: any) {
    this.editingdocument = document;
  }

  add_doc() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.position = { left: '30%' };
    dialogConfig.height = "auto";
    this.dialog.open(GestiondocumentComponent, dialogConfig);
  }

  add_dos() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.position = { left: '30%' };
    dialogConfig.height = "auto";
    const dialogRef = this.dialog.open(GestiondossierComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // Rechargez la liste des dossiers après la fermeture de la boîte de dialogue de gestion des dossiers.
      this.loadDossiers();
      // Chargez les documents pour le dossier ajouté (vous pouvez adapter cela en fonction de votre logique).
      if (result && result._id) {
        this.loadDocuments(result._id); // Utilisez l'ID du dossier ajouté.
      }
    });
  }

  

  refresh(): void {
    this.loadDossiers();
    this.loadDocuments();
  }

  addDocumentToDossier(dossier: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.position = { left: '30%' };
    dialogConfig.height = "auto";
    
    // Passer le nom du dossier à la fenêtre modale pour référence
    dialogConfig.data = { dossierName: dossier.name };
    
    const dialogRef = this.dialog.open(GestiondocumentComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(result => {
      // Rafraîchir la liste des documents après la fermeture de la fenêtre modale
      this.loadDocuments();
    });
  }
  
}
