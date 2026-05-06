const CRAWLER_USER_AGENTS = [
  'googlebot',
  'google-inspectiontool',
  'linkedinbot',
  'facebookexternalhit',
  'facebookcatalog',
  'meta-externalagent',
  'iframely',
  'twitterbot',
  'slackbot',
  'whatsapp',
  'bingbot',
  'applebot',
  'discordbot',
  'telegrambot',
  'embedly',
  'rogerbot',
  'vkshare',
  'pinterest',
  'screaming frog',
];

const IGNORE_EXTENSIONS = [
  '.js', '.css', '.xml', '.png', '.jpg', '.jpeg', '.gif',
  '.pdf', '.ico', '.zip', '.mp4', '.svg', '.webp', '.woff',
  '.woff2', '.ttf',
];

function isCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot));
}

function shouldIgnore(url) {
  const path = new URL(url).pathname.toLowerCase();
  return IGNORE_EXTENSIONS.some(ext => path.endsWith(ext));
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const userAgent = request.headers.get('user-agent') || '';
  const url = request.url;

  if (!isCrawler(userAgent) || shouldIgnore(url)) {
    try {
      return await next();
    } catch (err) {
      return new Response('Not found', { status: 404 });
    }
  }

  try {
    const prerenderRequest = new Request(url, {
      method: 'GET',
      headers: {
        'user-agent': userAgent,
        'X-Prerender-Request': 'true',
      },
      redirect: 'manual',
    });

    const response = await env.PRERENDER.fetch(prerenderRequest);

    // If the worker returned a redirect, pass it straight through.
    if (response.status >= 300 && response.status < 400) {
      return new Response(null, {
        status: response.status,
        headers: {
          'Location': response.headers.get('Location') || '/',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return response;
  } catch (err) {
    console.error('Prerender service failed:', err);
    return next();
  }
}
