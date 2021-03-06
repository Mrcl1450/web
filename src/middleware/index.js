import path from 'path';
import defaultFs from 'fs';
import hstream from 'hstream';
import router from 'router';
import serveStatic from 'serve-static';
import theme from '../theme';

function createManifest({ title }) {
  return {
    name: title,
    short_name: title,
    start_url: '.',
    theme_color: theme.palette.main,
    background_color: '#151515',
    display: 'standalone',
    icons: [{
      type: 'image/png',
      src: '/icon-white.png',
      sizes: '144x144',
    }],
  };
}

export default function uwaveWebClient(options = {}) {
  const {
    basePath = path.join(__dirname, '../public'),
    fs = defaultFs, // Should only be used by the dev server.
    title = 'üWave',
    ...clientOptions
  } = options;

  const indexHtml = fs.readFileSync(path.join(basePath, 'index.html'), 'utf8');
  const passwordResetHtml = fs.readFileSync(path.join(basePath, 'password-reset.html'), 'utf8');

  const clientRouter = router();
  const manifest = createManifest({ title });

  return clientRouter
    .get('/', (req, res) => {
      res.setHeader('content-type', 'text/html');

      const transform = hstream({
        title,
        '#u-wave-config': JSON.stringify(clientOptions),
      });

      transform.pipe(res);
      transform.end(indexHtml);
    })
    .get('/reset/:key', (req, res) => {
      res.setHeader('content-type', 'text/html');

      const transform = hstream({
        title,
        '#u-wave-config': JSON.stringify({ apiUrl: clientOptions.apiUrl }),
        '#reset-data': req.params.key,
      });

      transform.pipe(res);
      transform.end(passwordResetHtml);
    })
    .get('/manifest.json', (req, res) => {
      res.json(manifest);
    })
    .get('/u-wave-web-config.json', (req, res) => {
      res.json(clientOptions);
    })
    .use(serveStatic(basePath));
}
