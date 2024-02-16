import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule from the correct package

import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsernavComponent } from './usernav/usernav.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { HomeComponent } from './home/home.component';
import { ContestComponent } from './contest/contest.component';
import { CoursesComponent } from './courses/courses.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseComponent } from './course/course.component';
import { QuizComponent } from './quiz/quiz.component';
import { CourseModuleComponent } from './course-module/course-module.component';
import { ManageCoursesComponent } from './manage-courses/manage-courses.component';
import { ManagequizzesComponent } from './managequizzes/managequizzes.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UsernavComponent,
    AdminNavComponent,
    HomeComponent,
    ContestComponent,
    CoursesComponent,
    QuizzesComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    FooterComponent,
    SignupComponent,
    CourseComponent,
    QuizComponent,
    CourseModuleComponent,
    ManageCoursesComponent,
    ManagequizzesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
