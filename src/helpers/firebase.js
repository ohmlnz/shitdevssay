import * as firebase from 'firebase';
import { firebaseConfig } from '../firebase/config.js';

export function initializeFirebase() {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

export async function fetchDatabaseData() {
  const posts = await firebase
    .database()
    .ref('posts')
    .once('value');
  return posts.val();
}

export function writeToDatabase(url) {
  firebase
    .database()
    .ref('/posts/')
    .push()
    .update({
      author: 'Test',
      image: url,
      title: 'Title test.'
    });
}

export function registerUser(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw new Error(`${errorCode} - ${errorMessage}`);
    });
}

export function signInUser(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw new Error(`${errorCode} - ${errorMessage}`);
    });
}
