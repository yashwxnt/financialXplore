import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbexpressService } from '../course.service';

@Component({
  selector: 'app-manage-courses',
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.css']
})
export class ManageCoursesComponent implements OnInit {
  
  courseForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dbExpressService: DbexpressService
  ) {
    this.courseForm = this.formBuilder.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      courseSummary: ['', Validators.required],
      courseImageUrl: ['', Validators.required],
      totalQuizzes: ['', [Validators.required, Validators.min(0)]],
      courseCreatedBy: ['', Validators.required],
      courseCreatedDate: ['', Validators.required], // You might need to implement a custom validator for date format
      topics: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.addTopic(); // Add one initial topic field
  }

  addTopic(): void {
    this.topics.push(this.formBuilder.group({
      topicName: ['', Validators.required],
      pdf: [null, Validators.required] // File upload control
    }));
  }

  // Function to handle file selection
  onFileSelected(event: any, index: number): void {
    const file: File = event.target.files[0];
    // Update the form control value with the selected file
    this.topics.at(index).get('pdf').setValue(file);
  }

  createCourse(): void {
    if (this.courseForm.invalid) {
      return; // Form is invalid, do not proceed with submission
    }
    // Convert form value to JSON for sending to backend
    const formData = this.courseForm.value;
    this.dbExpressService.createCourse(formData)
      .subscribe(
        response => {
          console.log(response);
          // Reset the form after successful submission
          this.courseForm.reset();
          this.courseForm.markAsPristine();
          this.courseForm.markAsUntouched();
        },
        error => {
          console.error(error);
          // Handle error
        }
      );
  }

  get topics() {
    return this.courseForm.get('topics') as FormArray;
  }
}