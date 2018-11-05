import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const prodConfig = {
  apiKey: FB_API_KEY,
  projectId: FB_PROJECT_ID,
  databaseURL: FB_DATABASE_URL,
  authDomain: FB_AUTH_DOMAIN,
  storageBucket: FB_STORAGE_BUCKET,
  messagingSenderId: FB_MESSGING_SENDER_ID
};

const devConfig = Object.assign({}, prodConfig);

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

const auth = firebase.auth();

export { firebase, firestore, auth };
