importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBqM61ucKRr1IAbl0BdNVsSxLoXMfeFrxs',
  authDomain: 'afl3-93879.firebaseapp.com',
  databaseURL: 'https://afl3-93879.firebaseio.com',
  projectId: 'afl3-93879',
  storageBucket: 'afl3-93879.appspot.com',
  messagingSenderId: '269526583554',
  appId: '1:269526583554:web:c6415a2f5db0aa84f65a1b',
  vapidKey: 'BOuxXdsNVOrga9ECSzYTeFMj32rGP7q63t6GQXvfkWE9FEPTkqMknF7lDSFqGfA7DP7Qv4zizwUBy1kzHwyadKE',
});

const messaging = firebase.messaging();
