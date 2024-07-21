import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../document.service';
import { AjoutdocComponent } from '../ajoutdoc/ajoutdoc.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  documents: any[] = [];
  editingDocument: any = null;
 
  constructor(private documentService: DocumentService,private dialog: MatDialog,private auth:AuthService) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocuments(this.auth.getCurrentUsername()).subscribe({
      next: (documents: any[]) => {
        this.documents = documents;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
      }
    });
  }

  editDocument(document: any) {
    this.editingDocument = document;
  }

  saveDocumentChanges() {
    this.documentService.updateDocument(this.editingDocument).subscribe({
      next: (updatedDocument) => {
        console.log('Document updated successfully:', updatedDocument);
        this.loadDocuments();
        this.editingDocument = null;
      },
      error: (error) => {
        console.error('Error updating document:', error);
      }
    });
  }

  cancelEdit() {
    this.editingDocument = null;
  }

  deleteDocument(document: any) {
    this.documentService.deleteDocument(document.id).subscribe({
      next: mess => {
        console.log(mess);
        this.loadDocuments();
      },
      error: err => {
        console.log(err);
      }
    });
    console.log('Deleting document:', document);
  }

  addDocument() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.position = { left: '30%' };
    dialogConfig.height = "auto";
    this.dialog.open(AjoutdocComponent, dialogConfig);
  }
  
}
