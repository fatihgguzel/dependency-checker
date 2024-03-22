import { convertFromDirectory } from 'joi-to-typescript';

convertFromDirectory({
  schemaDirectory: './src/helpers/joi',
  typeOutputDirectory: './src/types',
  debug: true,
  useLabelAsInterfaceName: true,
  omitIndexFiles: true,
  treatDefaultedOptionalAsRequired: false,
  defaultToRequired: true,
  supplyDefaultsInType: false,
  sortPropertiesByName: false,
  fileHeader: "import { Errors } from './Errors';\nimport * as ENUMS from './enums';",
  ignoreFiles: ['joiGeneric.ts'],
});
