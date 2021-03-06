import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShelfComponent } from './book-case/shelf/shelf.component';
import { NewBookComponent } from './book-case/new-book/new-book.component';
import { BookComponent } from './book-case/book/book.component';
import { LoginComponent } from './pages/login/login.component';
import { NewNoteComponent } from './book-case/new-note/new-note.component';

const routes: Routes = [
  { path: '',
  redirectTo: '/books',
  pathMatch: 'full'
  },
  {
    path: 'new-book',
    component: NewBookComponent
  },
  { path: 'login', component: LoginComponent},
  { path: 'books', component: BookComponent},
  { path: 'books/:bookId', component: BookComponent},
  { path: 'books/:bookId/new-note', component: NewNoteComponent},
  { path: 'books/:bookId/edit', component: NewBookComponent},
  { path: 'books/:bookId/:noteId/edit', component: NewNoteComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
