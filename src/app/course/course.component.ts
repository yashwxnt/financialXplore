import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbexpressService } from '../course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent {
  // showEnrollButton: boolean = true;
  // showManageQuizCard: boolean = false;

  // selectedTopic: any;
  // selectedCourse: any;
  // topics: any[] = [];
  // staticImage: string = '';  // Add a property to store the static image URL

  // constructor(
  //   private route: ActivatedRoute,
  //   private dbexpressService: DbexpressService,
  //   private router: Router
  // ) {}

  // ngOnInit(): void {
  //   const navigationState = this.router.getCurrentNavigation()?.extras.state;
  //   if (navigationState && navigationState['courseDetails']) {
  //     this.staticImage = navigationState['courseDetails']['courseImage'];
  //     console.log('Static Image URL:', this.staticImage);
  //   }
  //   // Load course details based on the route parameter
  //   this.route.params.subscribe(params => {
  //     const courseId = params['id'];
      
  //     if (courseId) {
  //       // Make the API call to get course details using the courseId
  //       this.dbexpressService.getCourseById(courseId).subscribe(
  //         (response: any) => {
  //           this.selectedCourse = response.course;
  //           this.topics = response.course.topics; // Assuming that topics are available in the response
  //         },
  //         (error: any) => {
  //           console.error('Error loading course:', error);
  //           // Handle error as needed
  //         }
  //       );
  //     } else {
  //       console.error('CourseId is undefined.');
  //     }
  //   });
  }
  
  // course.component.ts
  // enrollClicked(): void {
  //   if (this.selectedCourse && this.selectedCourse._id) {
  //     // Redirect to the course-module page
  //     const courseId = this.selectedCourse._id;
  //     this.router.navigate(['/usernav/course-module', courseId]);  // Corrected navigation
  //   } else {
  //     console.error('Selected course or its _id is undefined.');
  //   }
  // }

