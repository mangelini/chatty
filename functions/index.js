const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createFirestoreUser = functions.auth.user().onCreate(user => {
  const userId = user.uid;
  const photo =
    user.photoURL ||
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

  return admin.firestore().collection('users').doc(userId).set({
    displayName: user.displayName,
    photoUrl: photo,
  });
});
