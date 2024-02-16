import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ModalService } from '../modal.service';
import { DbexpressService } from '../course.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(300)]),
      transition(':leave', animate(300, style({ opacity: 0 }))),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  courses: any[] = [];
  courseImages: string[] = [
    '/assets/img1.png',
    '/assets/img2.png',
    '/assets/img3.png',
    '/assets/img4.png',
    '/assets/img5.png',
    '/assets/investing.jpg'

  ];

  ngOnInit(): void {
      if (typeof document !== 'undefined') {
        const navbar = document.querySelector('.navbar');
  
        if (navbar) {
          // Set a scroll listener
          window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
              navbar.classList.add('navbar-scrolled');
            } else {
              navbar.classList.remove('navbar-scrolled');
            }
          });
        }
      }
   


    }
  }
