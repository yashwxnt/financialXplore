import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DbexpressService {
  constructor(private http: HttpClient) { }

  createCourse(course: any) {
    return this.http.post('http://localhost:4500/api/courses/uploadpdf', course, { responseType: 'json' });
  }
  

  updateCourse(course: any) {
    return this.http.put(`http://localhost:4500/api/courses/${course.courseId}`, course, { responseType: 'json' });
  }

  rateCourse(courseId: string, userId: string, rating: number) {
    return this.http.post('http://localhost:4500/api/courses/rate-course', { courseId, userId, rating });
  }

  addReview(courseId: string, userId: string, review: string, rating: number) {
    return this.http.post('http://localhost:4500/api/courses/reviews', { courseId, userId, review, rating });
  }

  deleteCourse(courseId: string) {
    return this.http.delete(`http://localhost:4500/api/courses/${courseId}`);
  }

  getAllCourses() {
    return this.http.get('http://localhost:4500/api/courses/all', { responseType: 'json' });
  }

  getCourseById(courseId: string) {
    return this.http.get(`http://localhost:4500/api/courses/${courseId}`, { responseType: 'json' });
  }
}
