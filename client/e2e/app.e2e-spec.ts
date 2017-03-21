import { HomeautomationClientPage } from './app.po';

describe('homeautomation-client App', () => {
  let page: HomeautomationClientPage;

  beforeEach(() => {
    page = new HomeautomationClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
