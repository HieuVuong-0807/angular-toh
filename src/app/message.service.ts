import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = [];
  constructor() { }

  

  add(message: string) {
    //this is a comment
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}
