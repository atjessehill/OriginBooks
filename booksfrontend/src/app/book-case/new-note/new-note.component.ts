import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../book.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.scss']
})
export class NewNoteComponent implements OnInit {

  editMode: boolean = false;
  selectedNote: any = [];

  constructor(private route: ActivatedRoute, private bookService: BookService, private router: Router) { }

  createNote(fNote: string, fPage: number){

    let id = this.route.snapshot.paramMap.get('bookId');
    let noteObj = {
      note: fNote,
      page: fPage,
      bookId: id
    }
    this.bookService.createNote(noteObj).subscribe((response: any) =>{
      console.log(response);

      let id = this.route.snapshot.paramMap.get('bookId');
      this.router.navigate(['books/', id]);
      //Now we navigate to /bookshelves/shelfId
    });
  }

  editNote(fNote: string, fPage: number){
    let bId = this.route.snapshot.paramMap.get('bookId');
    let nId = this.selectedNote._id;
    let noteObj = {
      bookId: bId,
      note: fNote,
      page: fPage,
      noteId: nId
    }
    console.log(bId);
    this.bookService.updateNote(noteObj).subscribe((response: any) =>{
      console.log(response);

      this.router.navigate(['books', bId]);
    });
  }

  ngOnInit() {

    if(this.route.url['_value'].length > 1){
      if(this.route.url['_value'][3].path === "edit"){
        let bookId = this.route.snapshot.paramMap.get('bookId');
        let noteId = this.route.snapshot.paramMap.get('noteId');
        this.editMode = true;
        this.bookService.getOneNote(bookId, noteId).subscribe((note: any[]) => {
          this.selectedNote = note;
          console.log(this.selectedNote);
        })
        console.log("edit mode");
      }
    }

  }

}
