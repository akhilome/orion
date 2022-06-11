/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const name = 'dist/index';
const bundle = (config) => ({
  input: 'src/index.ts',
  external: (id) => !/^[./]/.test(id),
  ...config,
});

export default [
  bundle({
    plugins: [esbuild({ minify: true })],
    output: {
      file: `${name}.js`,
      format: 'cjs',
      sourcemap: true,
    },
  }),
  bundle({
    plugins: [dts()],
    output: { file: `${name}.d.ts` },
  }),
];
