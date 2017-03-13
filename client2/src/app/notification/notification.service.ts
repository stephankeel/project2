import { Injectable } from '@angular/core';
import { Message } from 'primeng/primeng';

@Injectable()
export class NotificationService {

  message: Message[];

  constructor() {
    this.clear();
  }

  clear(): void {
    this.message = [];
  }

  success(detail: string, summary?: string): void {
    this.message.push({
      severity: 'success', summary: summary, detail: this.trim(detail)
    });
    let timer = setTimeout(() => {
      this.clear();
      clearTimeout(timer);
    } , 2000);
  }

  info(detail: string, summary?: string): void {
    this.message.push({
      severity: 'info', summary: summary, detail: this.trim(detail)
    });
  }

  warning(detail: string, summary?: string): void {
    this.message.push({
      severity: 'warn', summary: summary, detail: this.trim(detail)
    });
  }

  error(detail: string, summary?: string): void {
    this.message.push({
      severity: 'error', summary: summary, detail: this.trim(detail)
    });
  }

  private trim(str: string): string {
    if (str && str.length > 250) {
      return str.substr(0, 250) + '...';
    }
    return str;
  }
}
