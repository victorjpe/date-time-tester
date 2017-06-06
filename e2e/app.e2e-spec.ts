import { DateTimePage } from './app.po';

describe('date-time App', () => {
  let page: DateTimePage;

  beforeEach(() => {
    page = new DateTimePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
