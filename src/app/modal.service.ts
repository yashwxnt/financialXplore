import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private loginModalVisible = new BehaviorSubject<boolean>(false);
  private signupModalVisible = new BehaviorSubject<boolean>(false);

  showLoginModal() {
    this.loginModalVisible.next(true);
  }

  hideLoginModal() {
    this.loginModalVisible.next(false);
  }

  showSignupModal() {
    this.signupModalVisible.next(true);
  }

  hideSignupModal() {
    this.signupModalVisible.next(false);
  }

  getLoginModalState() {
    return this.loginModalVisible.asObservable();
  }

  getSignupModalState() {
    return this.signupModalVisible.asObservable();
  }

  constructor(private http: HttpClient) { }

  createQuiz(quiz: any) {
    return this.http.post('http://localhost:4500/quizzes/create', quiz, { responseType: 'json' });
  }

  updateQuiz(quiz: any) {
    return this.http.put(`http://localhost:4500/quizzes/update/${quiz.quizId}`, quiz, { responseType: 'json' });
  }

  generateRandomQuiz(courseId: string, topicId: string, difficultyLevel: number) {
    return this.http.post('http://localhost:4500/quizzes/generateRandomQuiz', { courseId, topicId, difficultyLevel });
  }

  getQuizzesForCourse(courseName: string) {
    return this.http.post('http://localhost:4500/quizzes/courseName', { courseName });
  }

  getQuizzesForTopic(courseId: string, topicId: string) {
    return this.http.post('http://localhost:4500/quizzes/quizzesForTopic', { courseId, topicId });
  }

  getQuizById(quizId: string) {
    return this.http.get(`http://localhost:4500/quizzes/quizForTopic/${quizId}`, { responseType: 'json' });
  }

  attemptQuiz(userId: string, quizId: string, userAnswers: any[]) {
    return this.http.post('http://localhost:4500/quizzes/attemptQuiz', { userId, quizId, userAnswers });
  }

  reviewQuiz(quizId: string) {
    return this.http.get(`http://localhost:4500/quizzes/reviewQuiz/${quizId}`, { responseType: 'json' });
  }

  saveQuizResults(userId: string, quizId: string, score: number, userAnswers: any[]) {
    return this.http.post('http://localhost:4500/quizzes/saveResults', { userId, quizId, score, userAnswers });
  }

  provideFeedback(quizId: string, userId: string, message: string) {
    return this.http.post(`http://localhost:4500/quizzes/provideFeedback/${quizId}`, { userId, message });
  }

  getQuizFeedback(quizId: string) {
    return this.http.get(`http://localhost:4500/quizzes/getFeedback/${quizId}`, { responseType: 'json' });
  }

  deleteQuiz(quizId: string) {
    return this.http.delete(`http://localhost:4500/quizzes/delete/${quizId}`);
  }

  getQuizStatistics(quizId: string) {
    return this.http.get(`http://localhost:4500/quizzes/statistics/${quizId}`, { responseType: 'json' });
  }

  getQuizAnalytics(quizId: string) {
    return this.http.get(`http://localhost:4500/quizzes/analytics/${quizId}`, { responseType: 'json' });
  }
}
