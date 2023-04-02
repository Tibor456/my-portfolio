import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'#contact', component:ContactComponent},
  {path:'#about', component:AboutComponent},
  {path:'#projects', component:ProjectsComponent}
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
