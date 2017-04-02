import {HomeautomationClientPage} from './app.po';

describe('homeautomation-client App', () => {
  let page: HomeautomationClientPage;

  beforeEach(() => {
    page = new HomeautomationClientPage();
  });

  it('should display header title', () => {
    page.navigateTo();
    page.getHeaderTitleText().then(text => {
      expect(text).toEqual('HOMEAUTOMATION');
    });
  });
});
