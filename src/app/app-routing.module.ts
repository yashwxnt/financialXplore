import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { SignupComponent } from './signup/signup.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UsernavComponent } from './usernav/usernav.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ContestComponent } from './contest/contest.component';
import { CourseComponent } from './course/course.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { QuizComponent } from './quiz/quiz.component';
import { CourseModuleComponent } from './course-module/course-module.component';
import { ManageCoursesComponent } from './manage-courses/manage-courses.component';
import { ManagequizzesComponent } from './managequizzes/managequizzes.component';

const routes: Routes = [
  { path: '', redirectTo: '/navbar/home', pathMatch: 'full' },
  {
    path: 'navbar',
    component: NavbarComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'sign-up', component: SignupComponent },
    ],
  },
  {
    path: 'usernav',
    component: UsernavComponent,
    children: [
      { path: 'courses', component: CoursesComponent },
      { path: 'course/:id', component: CourseComponent},
      { path: 'course-module/:id', component: CourseModuleComponent },
      { path: 'Quizz', component: QuizzesComponent },
      {path: 'quiz/:courseName/:topicName', component: QuizComponent},
      { path: 'user-dashboard', component: UserDashboardComponent }, 
      { path: 'contest', component: ContestComponent },
    ],
  },
  {
    path: 'admin-nav',
    component: AdminNavComponent,
    children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      {path: 'manage-Courses', component:ManageCoursesComponent},
      {path: 'manage-quizz', component:ManagequizzesComponent}
    ],
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
