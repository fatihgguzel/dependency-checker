export const GITHUB_BASE_URL = 'https://api.github.com';

export const NPM_REGISTRY_BASE_URL = 'https://registry.npmjs.org';

export const COMPOSER_REGISTRY_BASE_URL = 'https://repo.packagist.org';

export const CONTROL_PERIOD_IN_MS = 1000 * 60 * 60 * 24;

// TODO update this for other languages as well
export const DEPENDENCIES_CONFIG = {
  JAVASCRIPT: {
    dependencyFile: 'package.json',
    registry: 'npm',
  },
  PHP: {
    dependencyFile: 'composer.json',
    registry: 'packagist',
  },
};

// TODO update this for other languages as well
export const DEPENDENCY_KEY_NAMES = {
  'package.json': ['dependencies', 'devDependencies'],
  'composer.json': ['require', 'require-dev'],
};
