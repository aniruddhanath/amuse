;(function() {
  'use strict';

  const SUPPORTED_FORMATS = ['audio/mp3', 'audio/mp4', 'audio/mpeg'],
    PARTIALLY_SUPPORTED_FORMATS = ['application/octet-stream'],
    BLOCKED_PROTOCOLS = ['chrome-extension:'],
    BLOCKED_HOSTS = ['soundcloud.com'];

  function store(src, tabid) {
    chrome.tabs.get(tabid, tab => {

      let link = document.createElement('a');
      link.href = tab.url;

      if (BLOCKED_HOSTS.includes(link.hostname) || BLOCKED_PROTOCOLS.includes(link.protocol)) {
        return;
      }

      let jsonfile= {},
        src_parts = src.split('/'),
        fname = src_parts[src_parts.length - 1],
        key = btoa(src),
        data = {
          fname: decodeURI(fname),
          source: src,
          hostname: link.hostname,
          pageLink: tab.url,
          lastAccessed: Date.now()
        };
      chrome.storage.local.get(key, (obj) => {
        if (obj[key] && obj[key].fname) {
          data.fname = obj[key].fname;
        }
        jsonfile[key] = data;
        chrome.storage.local.set(jsonfile);
      });
    });
  }

  function isValid(content_type, url) {
    if (content_type && SUPPORTED_FORMATS.includes(content_type.value)) {
      return true;
    }
    if (content_type && PARTIALLY_SUPPORTED_FORMATS.includes(content_type.value)) {
      if (url && url.endsWith('.mp3')) { // todo - move to array
        return true;
      }
    }
    return false;
  }

  chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, tab => {
      // Tab opened.
    });
  });

  chrome.webRequest.onCompleted.addListener(details => {
    let content_type = details.responseHeaders && details.responseHeaders.find(res => res.name === 'Content-Type');

    if (isValid(content_type, details.url)) {
      store(details.url, details.tabId);
    }
  }, { urls: ['<all_urls>'] }, ['responseHeaders']);

})();