import { LEVNg2Page } from './app.po';

describe('lev-ng2 App', function() {
  let page: LEVNg2Page;

  beforeEach(() => {
    page = new LEVNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
