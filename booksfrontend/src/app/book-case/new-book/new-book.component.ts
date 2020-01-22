import { Component, OnInit } from '@angular/core';
import { BookService } from '../../book.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.scss']
})
export class NewBookComponent implements OnInit {


  editMode: boolean = false;
  selectedBook: any = [];
  constructor(private bookService: BookService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
      // this.route.params.subscribe(
      // (params: Params) => {
      //     console.log(params);
      //   }
      // )

    if(this.route.url['_value'].length > 1){
      if(this.route.url['_value'][2].path === "edit"){
        let id = this.route.snapshot.paramMap.get('bookId');
        this.editMode = true;
        this.bookService.getOneBook(id).subscribe((book: any[]) => {
          this.selectedBook = book;
          console.log(this.selectedBook);
        })
      }
    }



  }

  updateBook(fTitle: string, fAuthor: string, fGenre: string){
    let bookId = this.route.snapshot.paramMap.get('bookId');
    let book = {
      id: bookId,
      title: fTitle,
      author: fAuthor,
      genre: fGenre,
    }
    this.bookService.updateBook(book).subscribe((response: any) =>{
      // this.router.navigate(['/books', response._id]);
      //Now we navigate to /bookshelves/shelfId
    });
  }

  cancelEdit(){

    this.router.navigate(['/books', this.selectedBook._id]);
  }

  createBook(fTitle: string, fAuthor: string, fGenre: string){
    // this.bookService.createShelf(title).subscribe((response: any) =>{

    //   //Now we navigate to /bookshelves
    // });

    let book = {
      title: fTitle,
      author: fAuthor,
      genre: fGenre,
    }
    this.bookService.createBook(book).subscribe((response: any) =>{
      this.router.navigate(['/books', response._id])
      //Now we navigate to /bookshelves/shelfId
    });
  }

}
