import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { Update } from './views/update/update';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'apdate', component: Update },
  { path: '**', redirectTo: '' }
];
