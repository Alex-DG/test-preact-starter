import { render } from 'preact';
import GAnalytics from 'ganalytics';
import './index.sass';

let elem, App;
function init() {
	App = require('./views').default;
	elem = render(App, document.getElementById('root'), elem);
}

init();

if (process.env.NODE_ENV === 'production') {
  //  navigator.serviceWorker.register('/service-worker.js', {cache: 'no-cache'})
	// cache all assets if browser supports serviceworker
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/service-worker.js')
    .then(reg => {
      console.log(new Map(reg.headers));

      const newHeaders = new Headers(reg.headers);
      newHeaders.append("Cache-Control", "no-cache, no-store, must-revalidate");

      const anotherResponse = new Response(reg.body, {
        status: reg.status,
        statusText: reg.statusText,
        headers: newHeaders
      });

      console.log(new Map(anotherResponse.headers));
    })
    .catch(err => console.log('Boo!', err));
	}

  // if ('serviceWorker' in navigator && location.protocol === 'https:') {
  //
  //   window.addEventListener('load', function() {
  //   navigator.serviceWorker.register('/service-worker.js').then(function(reg) {
  //     // updatefound is fired if service-worker.js changes.
  //     reg.onupdatefound = function() {
  //       // The updatefound event implies that reg.installing is set; see
  //       // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
  //       var installingWorker = reg.installing;
  //
  //       installingWorker.onstatechange = function() {
  //         switch (installingWorker.state) {
  //           case 'installed':
  //             if (navigator.serviceWorker.controller) {
  //               // At this point, the old content will have been purged and the fresh content will
  //               // have been added to the cache.
  //               // It's the perfect time to display a "New content is available; please refresh."
  //               // message in the page's interface.
  //               console.log('New or updated content is available.');
  //             } else {
  //               // At this point, everything has been precached.
  //               // It's the perfect time to display a "Content is cached for offline use." message.
  //               console.log('Content is now available offline!');
  //             }
  //             break;
  //           case 'redundant':
  //             console.error('The installing service worker became redundant.');
  //             break;
  //           }
  //         };
  //       };
  //     }).catch(function(e) {
  //       console.error('Error during service worker registration:', e);
  //     });
  //   });
  // }

	// add Google Analytics
	window.ga = new GAnalytics('UA-XXXXXXXX-X');
} else {
	// use preact's devtools
	require('preact/devtools');
	// listen for HMR
	if (module.hot) {
		module.hot.accept('./views', init);
	}
}
