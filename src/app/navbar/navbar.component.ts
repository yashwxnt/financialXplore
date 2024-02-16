import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DbexpressService } from '../course.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  signupUsername: any;
  signupEmail: any;
  signupPassword: any;
  confirmPassword: any;
  phone: any;
  username: any;
  password: any;

  constructor(private router: Router, private dbService: DbexpressService, private el: ElementRef) { }
  scrollToCourse() {
    const courseSection = this.el.nativeElement.querySelector('#course');
    if (courseSection) {
      courseSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

 
}
