import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/book.service';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  constructor(private bookService: BookService, private route: ActivatedRoute, private router: Router) { }

  allBooks: any = []
  allNotes: any = []
  bookSelected: boolean;
  selectedBook: any = [];

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        if (params.bookId) {
          this.bookService.getNotes(params.bookId).subscribe((notes: any[]) => {
            this.allNotes = notes
            this.bookSelected = true;
          })
          this.bookService.getOneBook(params.bookId).subscribe((book: any[]) => {
            this.selectedBook = book;
          })
        } else{
          this.allNotes = undefined;
          this.bookSelected = false;
        }
        }
      )

    this.bookService.getBooks().subscribe((books: any[]) => {
      this.allBooks = books;
    });
  }

  newNoteCall(){
    let id = this.route.snapshot.paramMap.get('bookId');
    this.router.navigate(['books/', id, 'new-note']);
  }

  deleteBook(){
    let id = this.route.snapshot.paramMap.get('bookId');
    this.bookService.deleteBook(id).subscribe((res: any) => {
      this.router.navigate(['/books']);

    })

    // console.log("deleting book");
  }

  deleteNote(noteId: any){
    let bookId = this.route.snapshot.paramMap.get('bookId');
    this.bookService.deleteNote(bookId, noteId).subscribe((res: any) => {
      this.allNotes = this.allNotes.filter(val => val._id !== noteId);
      // console.log(res);
    })

  }

}
