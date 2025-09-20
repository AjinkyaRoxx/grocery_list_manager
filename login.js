import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } 
  from 'https://www.gstatic.com/firebasejs/10.6.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', ()=>{
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const authMessage = document.getElementById('authMessage');

    function showMessage(msg, isError=true){
        authMessage.innerText = msg;
        authMessage.style.color = isError ? 'red' : 'green';
    }

    loginBtn.addEventListener('click', async ()=>{
        const email = emailInput.value.trim();
        const password = passInput.value.trim();
        if(!email || !password){ showMessage("Enter both email & password."); return; }
        try{
            await signInWithEmailAndPassword(auth, email, password);
        }catch(e){ showMessage(e.message); }
    });

    registerBtn.addEventListener('click', async ()=>{
        const email = emailInput.value.trim();
        const password = passInput.value.trim();
        if(!email || !password){ showMessage("Enter both email & password."); return; }
        if(password.length < 6){ showMessage("Password must be ≥ 6 chars."); return; }
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            showMessage("Registered! Logging in...", false);
        }catch(e){ showMessage(e.message); }
    });

    onAuthStateChanged(auth, user=>{
        if(user) window.location.href='dashboard.html';
    });
});

