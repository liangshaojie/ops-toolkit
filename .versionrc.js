module.exports = {
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'docs', section: 'Documentation' },
    { type: 'style', section: 'Styles' },
    { type: 'refactor', section: 'Code Refactoring' },
    { type: 'perf', section: 'Performance Improvements' },
    { type: 'test', section: 'Tests' },
    { type: 'chore', section: 'Chores', hidden: true },
    { type: 'ci', section: 'Continuous Integration', hidden: true },
    { type: 'build', section: 'Builds', hidden: true },
    { type: 'revert', section: 'Reverts' },
  ],
  commitUrlFormat: 'https://github.com/username/ops-toolkit/commits/{{hash}}',
  compareUrlFormat: 'https://github.com/username/ops-toolkit/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat: 'https://github.com/username/ops-toolkit/issues/{{id}}',
};