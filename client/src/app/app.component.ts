import {Component} from "@angular/core";
import {Message} from 'primeng/primeng';
import {NotificationService} from './notification/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private notificationService: NotificationService) {
  }

  getMessages(): Message[] {
    return this.notificationService.message;
  }
}
