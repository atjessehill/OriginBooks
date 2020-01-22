import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ShelfComponent } from './book-case/shelf/shelf.component';
import { NewBookComponent } from './book-case/new-book/new-book.component';
import { BookComponent } from './book-case/book/book.component';
import { MatGridListModule } from '@angular/material';
import { LoginComponent } from './pages/login/login.component';
import { WebReqInterceptorService } from './web-req.interceptor.service';
import { NewNoteComponent } from './book-case/new-note/new-note.component';

@NgModule({
  declarations: [
    AppComponent, ShelfComponent, NewBookComponent, BookComponent, LoginComponent, NewNoteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatGridListModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
