import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.6.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {

    // DOM elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const authError = document.getElementById('authError');

    // Toggle forms
    showSignup.addEventListener('click', () => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        authError.innerText = '';
    });

    showLogin.addEventListener('click', () => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        authError.innerText = '';
    });

    // Login
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = loginEmail.value.trim();
        const password = loginPassword.value;
        if (!email || !password) {
            authError.innerText = 'Enter email and password.';
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'dashboard.html';
        } catch (err) {
            authError.innerText = err.message;
        }
    });

    // Signup
    signupBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        if (!email || !password) {
            authError.innerText = 'Enter email and password.';
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.location.href = 'dashboard.html';
        } catch (err) {
            authError.innerText = err.message;
        }
    });

    // Redirect if already logged in
    onAuthStateChanged(auth, user => {
        if (user) {
            window.location.href = 'dashboard.html';
        }
    });

});
