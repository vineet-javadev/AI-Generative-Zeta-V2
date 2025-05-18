import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ApiService } from '../api.service';

interface responseImage {
  user: string;
  message: any;
}

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    CommonModule,
    MarkdownModule // ✅ Correct for standalone
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  apiService = new ApiService();
  userMessage: string = '';
  aiResponse: responseImage[] = [];
  showModal: boolean = false;

  handleSubmit(): void {
    if (!this.userMessage.trim()) return;

    // Simulated AI response
    // this.aiResponse.push(this.sendMessage(this.userMessage));

    this.showModal = true;
    this.aiResponse.push({ user: 'User', message: this.userMessage });
    // a message show to user while ai thinking 
    this.aiResponse.push({ user: 'AI', message: 'Thinking...' });
    this.apiService.sendMessage(this.userMessage).then((aiMessage) => {
      // Remove the 'Thinking...' message
      this.aiResponse.pop();
      this.aiResponse.push({ user: 'AI', message: aiMessage });
    });
  }

  closeModal(): void {
    this.userMessage = '';
    this.aiResponse = [];
    this.showModal = false;
  }

}

