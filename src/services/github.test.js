import { parseGitHubUrl } from './github';

describe('parseGitHubUrl', () => {
  test('extracts owner and repo from a standard URL', () => {
    expect(parseGitHubUrl('https://github.com/mleahy79/gitstory')).toEqual({
      owner: 'mleahy79',
      repo: 'gitstory',
    });
  });

  test('strips a trailing .git suffix', () => {
    expect(parseGitHubUrl('https://github.com/mleahy79/gitstory.git')).toEqual({
      owner: 'mleahy79',
      repo: 'gitstory',
    });
  });

  test('ignores extra path segments after the repo name', () => {
    expect(parseGitHubUrl('https://github.com/mleahy79/gitstory/tree/main')).toEqual({
      owner: 'mleahy79',
      repo: 'gitstory',
    });
  });

  test('throws on a non-GitHub URL', () => {
    expect(() => parseGitHubUrl('https://gitlab.com/mleahy79/gitstory')).toThrow(
      'Invalid GitHub URL'
    );
  });

  test('throws on a malformed string', () => {
    expect(() => parseGitHubUrl('not a url')).toThrow('Invalid GitHub URL');
  });
});
