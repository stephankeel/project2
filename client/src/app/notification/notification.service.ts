import {Injectable} from "@angular/core";
import {Message} from "primeng/primeng";

@Injectable()
export class NotificationService {

  message: Message[];

  constructor() {
    this.clear();
  }

  clear(msg?: Message): void {
    if (msg) {
      let msgFrom = this.message.find(message => {
        return msg.severity === message.severity && msg.summary === message.summary && msg.detail === message.detail;
      });
      let index: number = this.message.indexOf(msgFrom);
      if (index >= 0) {
        this.message.splice(index, 1);
      }
    } else {
      this.message = [];
    }
  }

  private push(msg: Message, timeout: number): void {
    this.message.push(msg);
    let timer = setTimeout(() => {
      this.clear(msg);
    }, timeout);
  }

  success(detail: string, summary?: string): void {
    let msg : Message= {
      severity: 'success', summary: summary, detail: this.trim(detail)
    };
    this.push(msg, 5000);
  }

  info(detail: string, summary?: string): void {
    let msg : Message= {
      severity: 'info', summary: summary, detail: this.trim(detail)
    };
    this.push(msg, 5000);
  }

  warning(detail: string, summary?: string): void {
    let msg : Message = {
      severity: 'warn', summary: summary, detail: this.trim(detail)
    };
    this.push(msg, 10000);
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
