import { build, context } from 'esbuild';
import copy from 'esbuild-copy-files-plugin';
import progress from 'esbuild-plugin-progress';
import time from 'esbuild-plugin-time';
import simpleGit from 'simple-git';
import { readFileSync } from 'fs';
import http from 'http';
import serveStatic from 'serve-static';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

(async () => {
	/* if built on GitHub */
	const isRemote = !!process.env.environment;
	const isDev = process.env.environment === 'development';
	const prodPath = 'https://protokink.github.io/Responsive';
	const devPath = `${prodPath}/dev`;
	const remotePath = isDev ? devPath : prodPath;

	const PORT = 45000;
	const HOST = 'localhost';
	const localPath = `http://${HOST}:${PORT}`;
	const isLocal = process.argv.includes('--dev') || !isRemote;
	const watch = process.argv.includes('--watch');

	const PUBLIC_URL = `${isLocal ? localPath : remotePath}/public`;

	const git = simpleGit();
	const LAST_COMMIT_HASH = (await git.log({ maxCount: 1 }));
	const VERSION_HASH = LAST_COMMIT_HASH.latest.hash.substring(0, 8);

	const IS_DEVEL = isDev || isLocal;

	/** @type {import('esbuild').BuildOptions} */
	const buildOptions = {
		entryPoints: ['./src/responsive.ts'],
		outfile: './dist/main.js',
		format: 'iife',
		globalName: 'Responsive',
		bundle: true,
		sourcemap: true,
		target: ['es2020'],
		loader: {
			'.html': 'text',
			'.css': 'text',
		},
		treeShaking: true,
		keepNames: true,
		define: {
			PUBLIC_URL: JSON.stringify(PUBLIC_URL),
			MOD_VERSION: JSON.stringify(packageJson.version),
			LAST_COMMIT_HASH: JSON.stringify(LAST_COMMIT_HASH),
			VERSION_HASH: JSON.stringify(VERSION_HASH),
			IS_DEVEL: JSON.stringify(IS_DEVEL),
		},
		plugins: [
			copy({
				source: ['./public/'],
				target: './dist/public/',
				copyWithFolder: false
			}),
			progress(),
			time(),
		],
	};

	if (isLocal && watch) {
		const ctx = await context(buildOptions);

		await ctx.watch();
		console.info('Watching for changes...');

		serveWithCORS('dist', PORT, HOST);

		return;
	} else {
		await build(buildOptions)
			.catch((err) => {
				console.error(err);
				process.exit(1);
			});

		return;
	}

	throw new Error('Unknown environment. Shit happens.');
})();

/**
 * @param {string} dir 
 * @param {number} port 
 * @param {string} host 
 */
function serveWithCORS(dir, port, host) {
  const serve = serveStatic(dir, {
    /** @param {import('http').ServerResponse} res */
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  });

  const server = http.createServer((req, res) => {
    serve(req, res, (err) => {
      if (err) {
        res.statusCode = err.statusCode || 500;
        res.end(err.message || 'Internal Server Error');
        return;
      }

      res.statusCode = 404;
      res.end('Not Found');
    });
  });

  server.listen(port, host, () => {
    console.log(`🌐 Server running at http://${host}:${port}`);
  });
}