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
  ngOnInit() {
  }

}
