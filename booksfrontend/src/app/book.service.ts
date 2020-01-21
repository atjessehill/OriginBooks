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
    let userId = localStorage.getItem('user-id');

    return this.webReqService.post(`books`, { title, author, genre, userId })
  }

  getBooks(){
    return this.webReqService.get(`books`);
  }

  getNotes(shelfId: any, bookId: any){

    return this.webReqService.get(`books/${bookId}/notes`);
  }
}
