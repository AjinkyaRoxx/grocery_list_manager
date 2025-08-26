import { auth, db } from './firebaseConfig.js';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.6.1/firebase-auth.js';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.6.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', ()=>{
    const tableBody = document.getElementById('groceryTableBody');
    const addRowBtn = document.getElementById('addRow');
    const saveListBtn = document.getElementById('saveList');
    const savedListsContainer = document.getElementById('savedListsContainer');
    const logoutBtn = document.getElementById('logoutBtn');

    let currentUser=null;

    onAuthStateChanged(auth,user=>{
        if(!user) window.location.href='index.html';
        else currentUser=user;
    });

    logoutBtn.addEventListener('click', ()=>signOut(auth).then(()=>window.location.href='index.html'));

    function addRow(item=null){
        const row=document.createElement('tr');
        row.innerHTML=`
            <td><input type="text" class="description" value="${item?.description||''}"></td>
            <td><input type="number" class="quantity" value="${item?.quantity||1}"></td>
            <td><input type="number" class="mrp" value="${item?.mrp||0}"></td>
            <td><input type="number" class="rate" value="${item?.rate||0}"></td>
            <td class="discount-percent">0</td>
            <td><input type="number" class="gst-percent" value="${item?.gst||5}"></td>
            <td class="total-amount">0</td>
            <td><button class="btn-delete">Delete</button></td>
        `;
        tableBody.appendChild(row);
        row.querySelectorAll('input').forEach(i=>{
            i.addEventListener('input',()=>{ calculateRow(row); calculateTotals(); });
        });
        row.querySelector('.btn-delete').addEventListener('click', ()=>{
            row.remove(); calculateTotals();
        });
        calculateRow(row); calculateTotals();
    }

    function calculateRow(row){
        const qty=+row.querySelector('.quantity').value||0;
        const rate=+row.querySelector('.rate').value||0;
        const mrp=+row.querySelector('.mrp').value||0;
        const gst=+row.querySelector('.gst-percent').value||0;
        const total = qty*rate;
        const discount = mrp>0? ((mrp-rate)/mrp)*100:0;
        row.querySelector('.discount-percent').innerText=Math.round(discount);
        const gstAmt=total*gst/100;
        row.querySelector('.total-amount').innerText=(total+gstAmt).toFixed(2);
    }

    function calculateTotals(){
        let subtotal=0,totalGst=0,totalAmount=0;
        tableBody.querySelectorAll('tr').forEach(row=>{
            const qty=+row.querySelector('.quantity').value||0;
            const rate=+row.querySelector('.rate').value||0;
            const gst=+row.querySelector('.gst-percent').value||0;
            subtotal+=qty*rate;
            totalGst+=qty*rate*gst/100;
            totalAmount+=qty*rate*(1+gst/100);
        });
        document.getElementById('subtotal').innerText=subtotal.toFixed(2);
        document.getElementById('totalGst').innerText=totalGst.toFixed(2);
        document.getElementById('totalAmount').innerText=totalAmount.toFixed(2);
    }

    saveListBtn.addEventListener('click', async ()=>{
        if(!currentUser) return;
        const listName=`List-${Date.now()}`;
        const items=[];
        tableBody.querySelectorAll('tr').forEach(row=>{
            items.push({
                description:row.querySelector('.description').value,
                quantity:row.querySelector('.quantity').value,
                mrp:row.querySelector('.mrp').value,
                rate:row.querySelector('.rate').value,
                gst:row.querySelector('.gst-percent').value
            });
        });
        if(!items.length) return alert('Add items!');
        await setDoc(doc(db,'users',currentUser.uid,'lists',listName), {items, created: Date.now()});
        loadLists();
        alert('List saved!');
    });

    async function loadLists(){
        if(!currentUser) return;
        savedListsContainer.innerHTML='';
        const querySnap = await getDocs(collection(db,'users',currentUser.uid,'lists'));
        querySnap.forEach(docSnap=>{
            const div = document.createElement('div');
            div.innerHTML = `
                <span>${docSnap.id}</span>
                <button class="loadBtn">Load</button>
                <button class="delBtn">Delete</button>
            `;
            div.querySelector('.loadBtn').addEventListener('click', ()=>{
                tableBody.innerHTML='';
                docSnap.data().items.forEach(i=>addRow(i));
            });
            div.querySelector('.delBtn').addEventListener('click', async ()=>{
                await deleteDoc(doc(db,'users',currentUser.uid,'lists',docSnap.id));
                loadLists();
            });
            savedListsContainer.appendChild(div);
        });
    }

    addRowBtn.addEventListener('click', ()=>addRow());
    addRow();
    loadLists();
});
