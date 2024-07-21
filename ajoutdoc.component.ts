import { Component } from '@angular/core';
import { DocumentService } from '../document.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajoutdoc',
  templateUrl: './ajoutdoc.component.html',
  styleUrls: ['./ajoutdoc.component.css']
})

export class AjoutdocComponent {
  emplacement:string = '';
  name:string  =  '';
  extension:string =  '';
  type:string =  '';
  taille:number =  0;
  proprietaire:string = '';
  

  constructor(private documentService: DocumentService, private auth: AuthService, private router: Router) { 
    this.proprietaire = this.auth.getCurrentUsername();
  };

  submitForm() {
    this.emplacement = './' + this.name + '.' + this.extension;
    this.documentService.addDocument(this.emplacement,this.name,this.extension,this.type,this.taille,this.proprietaire).subscribe({
      next: doc => {
        console.log('document ajouté');
      },
      error: err => {
        console.log("erreur d'ajout");
      }
    });
  }
}