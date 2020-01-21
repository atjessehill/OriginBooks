import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/book.service';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  constructor(private bookService: BookService, private route: ActivatedRoute) { }

  allBooks: any = []
  allNotes: any = []
  bookSelected: boolean;

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        if (params.bookId) {
          this.bookService.getNotes(params.shelfId, params.bookId).subscribe((notes: any[]) => {
            this.allNotes = notes
            this.bookSelected = true;
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



}
