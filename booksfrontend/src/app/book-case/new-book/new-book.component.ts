import { Component, OnInit } from '@angular/core';
import { BookService } from '../../book.service';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.scss']
})
export class NewBookComponent implements OnInit {

  constructor(private bookService: BookService) { }

  ngOnInit() {
  }


  createBook(fTitle: string, fAuthor: string, fGenre: string){
    // this.bookService.createShelf(title).subscribe((response: any) =>{

    //   //Now we navigate to /bookshelves
    // });

    let book = {
      title: fTitle,
      author: fAuthor,
      genre: fGenre,
      shelfId: '5e24b0735e49f13e205e879a'
    }
    this.bookService.createBook(book).subscribe((response: any) =>{
      console.log(book);
      //Now we navigate to /bookshelves/shelfId
    });
  }
}
