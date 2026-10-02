/* Firebase Cloud Messaging service worker (background notifications)
   Note: This file must be served from the web app root (or app virtual root)
   so the Service Worker scope can cover your pages.
*/

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Keep in sync with the client config in assets/js/fcm-notify.js
firebase.initializeApp({
  apiKey: 'AIzaSyA2A_tudRnQTcrfr9zaxvXxmVAlRy9HVUc',
  authDomain: 'iu-notification-7cf54.firebaseapp.com',
  projectId: 'iu-notification-7cf54',
  storageBucket: 'iu-notification-7cf54.firebasestorage.app',
  messagingSenderId: '716994724011',
  appId: '1:716994724011:web:4462bd887a65d2491ab7ee'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  try {
    const title = (payload && payload.notification && payload.notification.title)
      ? payload.notification.title
      : (payload && payload.data && payload.data.title) ? payload.data.title : 'Thông báo';

    const body = (payload && payload.notification && payload.notification.body)
      ? payload.notification.body
      : (payload && payload.data && payload.data.body) ? payload.data.body : '';

    const options = {
      body: body,
      icon: 'logo.png',
      data: payload || {}
    };

    self.registration.showNotification(title, options);

    // Also forward to any open tabs so UI can update (badge/inbox)
    try {
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          try {
            clientList[i].postMessage({ type: 'FCM_BG_MESSAGE', payload: payload });
          } catch (ePost) {
          }
        }
      });
    } catch (eClients) {
    }
  } catch (e) {
    // no-op
  }
});