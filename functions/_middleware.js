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
    return next();
  }

  try {
    const prerenderRequest = new Request(url, {
      method: 'GET',
      headers: {
        'user-agent': userAgent,
        'X-Prerender-Request': 'true',
      },
    });

    const response = await env.PRERENDER.fetch(prerenderRequest);
    return response;

  } catch (err) {
    console.error('Prerender service failed:', err);
    return next();
  }
}
