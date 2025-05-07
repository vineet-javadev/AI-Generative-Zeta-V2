import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Mistral } from '@mistralai/mistralai';
import { MarkdownModule } from 'ngx-markdown';
import MISTRAL_API_KEY from '../../key';

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

 userMessage: string = '';
  aiResponse: responseImage[] = [];
  showModal: boolean = false;

  constructor() {
    this.sendMessage("hi");
  }

  async sendMessage(message: string) {
    const client = new Mistral({ apiKey: MISTRAL_API_KEY });


    const res = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: message }],
    });
    if (res.choices && res.choices[0] && res.choices[0].message) {
      console.log(res.choices[0].message.content);
      return res.choices[0].message.content;
    } else {
      alert('Error: Unexpected response structure');
      console.error('Unexpected response structure:', res);
      return "Something went wrong 'Try Again' ";
    }
  }

  handleSubmit(): void {
    if (!this.userMessage.trim()) return;

    // Simulated AI response
    // this.aiResponse.push(this.sendMessage(this.userMessage));

    this.showModal = true;
    this.aiResponse.push({ user: 'User', message: this.userMessage });
    // a message show to user while ai thinking 
    this.aiResponse.push({ user: 'AI', message: 'Thinking...' });
    this.sendMessage(this.userMessage).then((aiMessage) => {
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

