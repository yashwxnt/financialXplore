import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbexpressService } from '../course.service';

interface QuizItem {
  question: string;
  answers: { text: string; correct: boolean }[];
}

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent {
  
  }