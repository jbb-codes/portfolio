import { routes } from './app.routes';

describe('routes', () => {
  it('should expose only the single-page home route and the 404 wildcard', () => {
    expect(routes.map((route) => route.path)).toEqual(['', '**']);
  });
});
