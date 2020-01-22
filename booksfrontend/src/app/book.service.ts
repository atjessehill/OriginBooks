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

  createNote(noteJson: any){
    let note = noteJson.note;
    let page = noteJson.page;
    let bookId = noteJson.bookId;

    return this.webReqService.post(`books/${bookId}/notes`, {note, page});
  }

  createBook(bookJson: any){
    let title = bookJson.title;
    let author = bookJson.author;
    let genre = bookJson.genre;
    let userId = localStorage.getItem('user-id');

    return this.webReqService.post(`books`, { title, author, genre, userId });
  }

  updateBook(bookJson: any){
    let title = bookJson.title;
    let author = bookJson.author;
    let genre = bookJson.genre;
    let userId = localStorage.getItem('user-id');
    let bookId = bookJson.id;
    return this.webReqService.patch(`books/${bookId}`, { title, author, genre });

  }

  updateNote(noteJson: any){
    let bookId = noteJson.bookId;
    let noteId = noteJson.noteId;
    let note = noteJson.note;
    let page = noteJson.page;

    return this.webReqService.patch(`books/${bookId}/notes/${noteId}`, {note, page});
  }

  getBooks(){
    return this.webReqService.get(`books`);
  }

  getOneBook(bookId: any){
    return this.webReqService.get(`books/${bookId}`);
  }

  getNotes(bookId: any){

    return this.webReqService.get(`books/${bookId}/notes`);
  }

  getOneNote(bookId: any, noteId: any){

    return this.webReqService.get(`books/${bookId}/notes/${noteId}`);
  }

  deleteBook(bookId: any){

    return this.webReqService.delete(`books/${bookId}`);
  }

  deleteNote(bookId: any, noteId: any){
    return this.webReqService.delete(`books/${bookId}/note/${noteId}`);
  }
}
