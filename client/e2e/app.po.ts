import { browser, element, by } from 'protractor';

export class HomeautomationClientPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeaderTitleText()  {
    return element(by.css('.header__title')).getText();
  }
}
