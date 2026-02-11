
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/manageFijos/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/manageFijos"
  },
  {
    "renderMode": 2,
    "route": "/manageFijos/apdate"
  },
  {
    "renderMode": 2,
    "redirectTo": "/manageFijos",
    "route": "/manageFijos/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 55185, hash: '688de21f941c79e71aac58f302fa24c2785395150f27e82779d4ff2d06c96804', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1713, hash: '3d9f77693e6d3513bb6ca0c916438f8365b4012c68f4b443b45ef313bc03057a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 110331, hash: 'cb6efb54756597508f81bd870ba32ebd505bd34a0a36dc69229e9ee646ca6760', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'apdate/index.html': {size: 95385, hash: '4866b427ab4109c1e6c12cebbbfe71c9fa1aa9e7b0617990c6d5962b89cbe817', text: () => import('./assets-chunks/apdate_index_html.mjs').then(m => m.default)},
    'styles-IWE7SNNK.css': {size: 104747, hash: 'KOHophqDJZI', text: () => import('./assets-chunks/styles-IWE7SNNK_css.mjs').then(m => m.default)}
  },
};
