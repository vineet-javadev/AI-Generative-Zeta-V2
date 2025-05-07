import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-masterhead',
  imports: [CommonModule , RouterModule],
  templateUrl: './masterhead.component.html',
  styleUrl: './masterhead.component.css'
})
export class MasterheadComponent {
  // Define the developer and project information
  developer = {
    name: 'Vineet K. Chauhan',
    role: 'Java FullStack Developer',
    about: 'Hey, I\'m passionate about building intelligent, scalable applications with Spring Boot, Spring AI, and modern front-end frameworks like React, Angular Js, and Tailwind CSS.',
    profilePic: 'https://avatars.githubusercontent.com/u/168909675?v=4',
    social: [
      { name: 'GitHub', url: 'https://github.com/vineet-javadev' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/vineet-javadev/' },
      { name: 'Docs', url: 'https://portfolio-vineet-javadevs-projects.vercel.app/' }
    ]
  };

  project = {
    name: 'AI Generative Zeta',
    tagline: 'Empowering smart dialogues with real-time intelligence.'
  };
}
