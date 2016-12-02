import { SPAANGULARPage } from './app.po';

describe('spa-angular App', function() {
  let page: SPAANGULARPage;

  beforeEach(() => {
    page = new SPAANGULARPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
