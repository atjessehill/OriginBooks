import { Component, OnInit } from '@angular/core';
import { BookComponent } from '../book/book.component';
import { BookService } from '../../book.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss']
})
export class ShelfComponent implements OnInit {

  constructor(private bookService: BookService, private route: ActivatedRoute) { }

  lists: any;

  allbooks: any = []

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        console.log(params);
      }

    )
    this.bookService.getBooks().subscribe((books: any[]) => {
      this.allbooks = books;
    });
  }


}
