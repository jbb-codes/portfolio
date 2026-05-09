import { routeFadeAnimation } from './route-animations';

describe('routeFadeAnimation', () => {
  it('should be defined', () => {
    expect(routeFadeAnimation).toBeDefined();
  });

  it('should have the name "routeFadeAnimation"', () => {
    expect(routeFadeAnimation.name).toBe('routeFadeAnimation');
  });

  it('should define at least one transition', () => {
    expect(routeFadeAnimation.definitions.length).toBeGreaterThan(0);
  });
});
