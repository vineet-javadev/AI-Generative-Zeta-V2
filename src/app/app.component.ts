import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface responseImage {
  user: string;
  message: any;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ai-generative zeta';

}