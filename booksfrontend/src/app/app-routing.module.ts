import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShelfComponent } from './book-case/shelf/shelf.component';
import { NewBookComponent } from './book-case/new-book/new-book.component';
import { BookComponent } from './book-case/book/book.component';
import { LoginComponent } from './pages/login/login.component';

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
  // { path: 'bookshelf', component: ShelfComponent},
  // { path: 'bookshelf/:shelfId', component: ShelfComponent},
  { path: 'books', component: BookComponent},
  { path: 'books/:bookId', component: BookComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
