import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>('http://localhost:4500/users/register', userData);
  }

  uploadProfilePicture(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return this.http.post<any>(`http://localhost:4500/users/uploadProfilePicture/${userId}`, formData);
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post<any>('http://localhost:4500/users/login', credentials);
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>('http://localhost:4500/users/reset-password', { email });
  }

  enrollUser(userId: string, courseId: string): Observable<any> {
    return this.http.post<any>('http://localhost:4500/users/enroll', { userId, courseId });
  }

  submitFeedback(userId: string, courseId: string, feedbackMessage: string, rating: number): Observable<any> {
    return this.http.post<any>('http://localhost:4500/users/feedback', { userId, courseId, feedbackMessage, rating });
  }

  getUserPerformance(userId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:4500/users/performance/${userId}`);
  }

  updateUserProfile(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:4500/users/updateProfile/${userId}`, userData);
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`http://localhost:4500/users/changePassword/${userId}`, { oldPassword, newPassword });
  }

  deleteAccount(userId: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:4500/users/deleteAccount/${userId}`);
  }

  getCurrentUser(userId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:4500/users/getCurrentUser/${userId}`);
  }

  getUserEnrolledCourses(userId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:4500/users/getUserEnrolledCourses/${userId}`);
  }
}


