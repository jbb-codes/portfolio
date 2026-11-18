type Rgb = [number, number, number];

const relativeLuminance = ([red, green, blue]: Rgb): number => {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const unit = channel / 255;
    return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (foreground: Rgb, background: Rgb): number => {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
};

const parseHex = (hex: string): Rgb => {
  const value = hex.trim().replace('#', '');
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16)) as Rgb;
};

const parseRgba = (value: string): [...Rgb, number] => {
  const [red, green, blue, alpha = 1] = value.match(/[\d.]+/g)!.map(Number);
  return [red, green, blue, alpha];
};

const overlay = ([red, green, blue, alpha]: [...Rgb, number], base: Rgb): Rgb =>
  [red, green, blue].map((channel, index) =>
    Math.round(channel * alpha + base[index] * (1 - alpha)),
  ) as Rgb;

describe('theme colour contrast (WCAG AA)', () => {
  const readToken = (name: string): string =>
    getComputedStyle(document.documentElement).getPropertyValue(name);

  afterEach(() => document.documentElement.removeAttribute('data-theme'));

  (['dark', 'light'] as const).forEach((theme) => {
    describe(`${theme} theme`, () => {
      beforeEach(() => {
        if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
      });

      const page = (): Rgb => parseHex(readToken('--bg-primary'));
      const glassCard = (): Rgb => overlay(parseRgba(readToken('--glass-bg')), page());

      ['--text-primary', '--text-secondary', '--text-tertiary', '--accent-text'].forEach(
        (token) => {
          it(`${token} reaches 4.5:1 on the page and on glass cards`, () => {
            const text = parseHex(readToken(token));

            expect(contrastRatio(text, page())).toBeGreaterThanOrEqual(4.5);
            expect(contrastRatio(text, glassCard())).toBeGreaterThanOrEqual(4.5);
          });
        },
      );

      it('white button text reaches 4.5:1 on the accent button', () => {
        expect(contrastRatio([255, 255, 255], parseHex(readToken('--btn-accent')))).toBeGreaterThanOrEqual(4.5);
      });
    });
  });
});
