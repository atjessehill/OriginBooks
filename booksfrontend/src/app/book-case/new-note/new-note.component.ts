import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../book.service';


@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.scss']
})
export class NewNoteComponent implements OnInit {

  constructor(private route: ActivatedRoute, private bookService: BookService) { }

  createNote(fNote: string, fPage: number){

    let id = this.route.snapshot.paramMap.get('bookId');
    let noteObj = {
      note: fNote,
      page: fPage,
      bookId: id
    }
    this.bookService.createNote(noteObj).subscribe((response: any) =>{
      console.log(response);
      //Now we navigate to /bookshelves/shelfId
    });
  }
  ngOnInit() {
  }

}
