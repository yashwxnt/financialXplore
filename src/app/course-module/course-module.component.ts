import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbexpressService } from '../course.service';

@Component({
  selector: 'app-course-module',
  templateUrl: './course-module.component.html',
  styleUrls: ['./course-module.component.css']
})
export class CourseModuleComponent{
//   courseId: string = '';
//   course: any = {};

//   constructor(private route: ActivatedRoute, private dbService: DbexpressService) {}

// // course-module.component.ts
// ngOnInit(): void {
//   this.route.params.subscribe(params => {
//     const courseIdParam = params['id'];
//     this.courseId = courseIdParam ? courseIdParam : 'default-value';
//     this.loadCourse();
//   });
// }


//   loadCourse(): void {
//     this.dbService.getCourseById(this.courseId).subscribe(
//       (response: any) => {
//         this.course = response.course;
//       },
//       (error: any) => {
//         console.error('Error loading course:', error);
//         // Handle error as needed
//       }
//     );
//   }

//   getBase64Image(buffer: any): string {
//     if (buffer && buffer.data && buffer.data.length > 0) {
//       const binary = buffer.data.reduce((data: string, byte: number) => data + String.fromCharCode(byte), '');
//       return `data:image/jpeg;base64,${btoa(binary)}`;
//     }
//     return '';
//   }
}
