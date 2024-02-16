import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DbexpressService } from '../course.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router, NavigationExtras } from '@angular/router';

export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent {
  // courses: any[] = [];
  // courseImages: string[] = [
  //   '/assets/img1.png',
  //   '/assets/img2.png',
  //   '/assets/img3.png',
  //   '/assets/img4.png',
  //   '/assets/img5.png',
  //   '/assets/investing.jpg'

  // ];

  // constructor(private dbService: DbexpressService, private router: Router) {}

  // ngOnInit(): void {
  //   this.loadCourses();
  // }

  // loadCourses() {
  //   this.dbService.getAllCourses().subscribe(
  //     (response) => {
  //       console.log('Courses response:', response);
  
  //       // Check if the 'courses' property exists in the response
  //       if (response.courses && response.courses.length > 0) {
  //         // Assign the courses array to your component property
  //         this.courses = response.courses.map((course: any, index: number) => {
  //           // Use index to get the corresponding image URL from the array
  //           course.courseImage = this.courseImages[index];
  //           return course;
  //         });
  //       } else {
  //         console.error('No courses found in the response.');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error loading courses:', error);
  //     }
  //   );
  // }
  
  // navigateToCourseDetails(course: any) {
  //   // Use NavigationExtras to pass data to the next page
  //   const navigationExtras: NavigationExtras = {
  //     state: {
  //       courseDetails: course
  //     }
  //   };
  
  //   // Navigate to the next page (replace 'your-next-page' with the actual route)
  //   this.router.navigate(['/usernav/course', course._id], navigationExtras);
  // }
}
