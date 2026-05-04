import { spawnSync } from 'node:child_process';

function git(args) {
  return spawnSync('git', args, {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  });
}

function value(args) {
  const result = git(args);
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function fail(message) {
  console.error(`BLOCKED: ${message}`);
  process.exit(1);
}

const releaseMode = process.argv.includes('--release');
const branch = value(['rev-parse', '--abbrev-ref', 'HEAD']);
const status = value(['status', '--short']) || '';
const upstream = value(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
const allowMainWork = process.env.AIVOLO_ALLOW_MAIN_WORK === '1';

if (!branch) {
  fail('Unable to determine git branch.');
}

if (releaseMode) {
  if (status) {
    fail('Release check requires a clean worktree. Commit or stash changes first.');
  }

  console.log(`OK: release guard passed on clean branch ${branch}.`);
  console.log('Next: run the risk-appropriate verification, push the current branch, open a PR to main, then merge after Vercel is green.');
  process.exit(0);
}

if (branch === 'main' && !allowMainWork) {
  fail([
    'Do not do development work directly on main.',
    'Create a feature branch first:',
    '  git checkout main',
    '  git pull origin main',
    '  git checkout -b feature/<short-name>',
    'For an intentional hotfix/release task only, rerun with AIVOLO_ALLOW_MAIN_WORK=1.',
  ].join('\n'));
}

if (!allowMainWork && upstream && upstream === 'origin/main') {
  fail(`Current branch tracks origin/main. Use a feature branch instead. Current branch: ${branch}`);
}

console.log(`OK: agent guard passed on branch ${branch}.`);

if (status) {
  console.log('Note: worktree has local changes. Review scope before committing.');
}
