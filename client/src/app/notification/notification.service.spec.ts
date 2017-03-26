import {TestBed, async, inject} from '@angular/core/testing';
import {NotificationService} from './notification.service';
import {setTimeout} from "timers";
import {Message} from "primeng/primeng";

describe('NotificationService', () => {

  let setTimeout;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    jasmine.createSpy("timerCallback");
    setTimeout = spyOn(global, 'setTimeout');
  });

  it('should create', inject([NotificationService], (service: NotificationService) => {
    expect(service).toBeTruthy();
  }));

  it('should set info message, trim to 250 chars', inject([NotificationService], (service: NotificationService) => {
    let messageWith251Chars: string = "123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 1";
    service.info(messageWith251Chars);
    expect(service.message).toEqual([
      {severity: 'info', summary: undefined, detail: `${messageWith251Chars.substr(0, 250)}...`}
    ]);
    expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 5000);
  }));

  it('should clear messages', inject([NotificationService], (service: NotificationService) => {
    service.info("info1");
    expect(service.message.length).toEqual(1);
    service.info("info2");
    expect(service.message.length).toEqual(2);
    service.clear();
    expect(service.message.length).toEqual(0);
  }));

  it('should clear messages info1', inject([NotificationService], (service: NotificationService) => {
    service.info("info1");
    expect(service.message.length).toEqual(1);
    service.info("info2");
    expect(service.message.length).toEqual(2);
    service.clear( {severity: 'info', summary: undefined, detail: "info2"});
    expect(service.message).toEqual([
      {severity: 'info', summary: undefined, detail: 'info1'}
    ]);
  }));

  it('should set info message', inject([NotificationService], (service: NotificationService) => {
    service.info("infoMessage");
    expect(service.message).toEqual([
      {severity: 'info', summary: undefined, detail: "infoMessage"}
    ]);
    expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 5000);
  }));

  it('should set info message with summary', inject([NotificationService], (service: NotificationService) => {
    service.info("infoMessage", "summary1");
    expect(service.message).toEqual([{
      severity: 'info', summary: "summary1", detail: "infoMessage"
    }]);
    expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 5000);
  }));

  it('should set success message', inject([NotificationService], (service: NotificationService) => {
    service.success("successMessage");
    expect(service.message).toEqual([{
      severity: 'success', summary: undefined, detail: "successMessage"
    }]);
    expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 5000);
  }));

  it('should set success message with summary', inject([NotificationService], (service: NotificationService) => {
    service.success("successMessage", "summary1");
    expect(service.message).toEqual([{
      severity: 'success', summary: "summary1", detail: "successMessage"
    }]);
    expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 5000);
  }));

  it('should set warning message', inject([NotificationService], (service: NotificationService) => {
    service.warning("warnMessage");
    expect(service.message).toEqual([{
      severity: 'warn', summary: undefined, detail: "warnMessage"
    }]);
    expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 10000);
  }));

  it('should set warning message with summary', inject([NotificationService], (service: NotificationService) => {
    service.warning("warnMessage", "summary1");
    expect(service.message).toEqual([{
      severity: 'warn', summary: "summary1", detail: "warnMessage"
    }]);
    expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 10000);
  }));

  it('should set error message', inject([NotificationService], (service: NotificationService) => {
    service.error("errorMessage");
    expect(service.message).toEqual([{
      severity: 'error', summary: undefined, detail: "errorMessage"
    }]);
  }));

  it('should set error message with summary', inject([NotificationService], (service: NotificationService) => {
    service.error("errorMessage", "summary1");
    expect(service.message).toEqual([{
      severity: 'error', summary: "summary1", detail: "errorMessage"
    }]);
  }));
});
