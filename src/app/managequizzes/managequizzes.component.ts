import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms'; // Import FormArray and AbstractControl
import { DbexpressService } from '../course.service';

@Component({
  selector: 'app-managequizzes',
  templateUrl: './managequizzes.component.html',
  styleUrls: ['./managequizzes.component.css']
})
export class ManagequizzesComponent implements OnInit {
  constructor(private fb: FormBuilder, private dbService: DbexpressService) {}

  this.quizForm = this.formBuilder.group({
    course: ['', Validators.required],
    topic: ['', Validators.required],
    durationMinutes: [15, [Validators.required, Validators.min(1)]],
    numQuestions: [1, [Validators.required, Validators.min(1)]],
    totalCoins: [10, Validators.min(0)],
    questions: this.formBuilder.array([
      this.createQuestion()
    ])
  });
}
   

  createQuestion(): FormGroup {
    return this.formBuilder.group({
      questionText: ['', Validators.required],
      options: this.formBuilder.array([
        this.formBuilder.control('', Validators.required),
        this.formBuilder.control('', Validators.required)
      ]),
      correctOptionIndex: [0, [Validators.required, Validators.min(0)]],
      coinsPerCorrectAnswer: [1, Validators.min(0)]
    });
  }

  addQuestion(): void {
    const questions = this.quizForm.get('questions') as FormArray;
    questions.push(this.createQuestion());
  }

  removeQuestion(index: number): void {
    const questions = this.quizForm.get('questions') as FormArray;
    questions.removeAt(index);
  }

  submitQuiz(): void {
    if (this.quizForm.valid) {
      this.modalService.createQuiz(this.quizForm.value)
        .subscribe(
          (response) => {
            console.log('Quiz created successfully:', response);
            // Clear the form after successful submission if needed
            this.quizForm.reset();
          },
          (error) => {
            console.error('Error creating quiz:', error);
            // Handle error appropriately (e.g., show error message to the user)
          }
        );
    } else {
      // Mark form controls as touched to display validation errors
      this.quizForm.markAllAsTouched();
    }
  }

