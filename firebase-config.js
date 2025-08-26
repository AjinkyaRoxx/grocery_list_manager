import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.6.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyD-Q-7DzSfnKLilGzJe20JoVcHcZmI2Xj4",
  authDomain: "grocery-manager-1ed63.firebaseapp.com",
  projectId: "grocery-manager-1ed63",
  storageBucket: "grocery-manager-1ed63.appspot.com",  // <-- fixed
  messagingSenderId: "991897795361",
  appId: "1:991897795361:web:7e0200b1cdc078a4e51c60"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
