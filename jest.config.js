module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(ts)$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
