import {
  BUCKET_LIST,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  INTERESTS,
  LEARNING_NEXT,
  SKILLS,
  TIMELINE_ENTRIES,
  PROJECTS,
} from './portfolio-content';

describe('portfolio-content', () => {
  it('EXPERIENCE is non-empty', () => {
    expect(EXPERIENCE.length).toBeGreaterThan(0);
  });

  it('EDUCATION is non-empty', () => {
    expect(EDUCATION.length).toBeGreaterThan(0);
  });

  it('SKILLS is non-empty', () => {
    expect(SKILLS.length).toBeGreaterThan(0);
  });

  it('each skill level is within 0–100', () => {
    for (const skill of SKILLS) {
      expect(skill.level).toBeGreaterThanOrEqual(0);
      expect(skill.level).toBeLessThanOrEqual(100);
    }
  });

  it('CERTIFICATIONS is non-empty', () => {
    expect(CERTIFICATIONS.length).toBeGreaterThan(0);
  });

  it('LEARNING_NEXT is non-empty', () => {
    expect(LEARNING_NEXT.length).toBeGreaterThan(0);
  });

  it('INTERESTS is non-empty', () => {
    expect(INTERESTS.length).toBeGreaterThan(0);
  });

  it('TIMELINE_ENTRIES is non-empty', () => {
    expect(TIMELINE_ENTRIES.length).toBeGreaterThan(0);
  });

  it('BUCKET_LIST is non-empty', () => {
    expect(BUCKET_LIST.length).toBeGreaterThan(0);
  });

  it('BUCKET_LIST ids are unique', () => {
    const ids = BUCKET_LIST.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // === Begin: written with Claude guidance ===
  // The PROJECTS import and the three tests below were written as part of a
  // hands-on TDD learning exercise — I typed and applied each step as part of that process.
  it('PROJECTS is non-empty', () => {
    expect(PROJECTS.length).toBeGreaterThan(0);
  });

  it('each project has a non-empty technologies array', () => {
    for (const project of PROJECTS) {
      expect(project.technologies.length).toBeGreaterThan(0);
    }
  });

  it('PROJECTS numbers are unique', () => {
    const numbers = PROJECTS.map((proj) => proj.number);
    expect(new Set(numbers).size).toBe(numbers.length);
  });
  // === End: written with Claude guidance ===
});
