import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private webReqService: WebRequestService) { }

  createShelf(name: string){
    return this.webReqService.post('bookshelf', { name })
  }

  createBook(bookJson: any){
    let title = bookJson.title;
    let author = bookJson.author;
    let genre = bookJson.genre;
    let _shelfId = bookJson.shelfId;

    return this.webReqService.post(`bookshelf/${_shelfId}/books`, { title, author, genre })
  }

  getBooks(){
    let _shelfId = '5e24b0735e49f13e205e879a'
    return this.webReqService.get(`bookshelf/${_shelfId}/books`);
  }

  getNotes(shelfId: any, bookId: any){

    return this.webReqService.get(`bookshelf/${shelfId}/books/${bookId}/notes`);
  }
}
