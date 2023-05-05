import { schema } from '@glossify/backend/src/schema';
import type { CodegenConfig } from '@graphql-codegen/cli';
import { printSchema } from 'graphql';

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: '../frontend/src/**/*.tsx',
  generates: {
    './src/': {
      preset: 'client'
    }
  }
};

export default config;
