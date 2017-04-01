import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBlindsCommand} from '../../../../../../server/entities/blinds-command.interface';
import {BlindsAction} from '../../../../../../server/entities/blinds-action';
import {BlindsCommandService} from '../../../remote/blinds-command.service';
import {NotificationService} from '../../../notification/notification.service';

@Component({
  selector: 'app-blinds-buttons',
  templateUrl: './blinds-buttons.component.html',
  styleUrls: ['./blinds-buttons.component.scss'],
})
export class BlindsButtonsComponent implements OnInit {

  @Input() deviceId?: any;
  @Output() message: EventEmitter<string> = new EventEmitter<string>();

  constructor(private commandService: BlindsCommandService, private notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  keyUpAction(): void {
    let cmd: IBlindsCommand = {
      id: this.deviceId,
      action: BlindsAction.OPEN
    };
    this.commandService.command(cmd).subscribe((done: boolean) => {
    }, (err: any) => this.notificationService.error(err.toString()));
  }

  keyDownAction(): void {
    let cmd: IBlindsCommand = {
      id: this.deviceId,
      action: BlindsAction.CLOSE
    };
    this.commandService.command(cmd).subscribe((done: boolean) => {
    }, (err: any) => this.notificationService.error(err.toString()));
  }

  stopAction(): void {
    let cmd: IBlindsCommand = {
      id: this.deviceId,
      action: BlindsAction.STOP
    };
    this.commandService.command(cmd).subscribe((done: boolean) => {
    }, (err: any) => this.notificationService.error(err.toString()));
  }

}
