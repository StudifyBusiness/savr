import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH8aAKoyjGyMB8Cu_vzY4YuNgaaNmA5ec",
  authDomain: "studify-d2fbc.firebaseapp.com",
  projectId: "studify-d2fbc",
  storageBucket: "studify-d2fbc.firebasestorage.app",
  messagingSenderId: "857227078095",
  appId: "1:857227078095:web:4afd99e714e7ef471ecaba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Grocery list logic
const groceryInput = document.getElementById("grocery-input");
const addGroceryBtn = document.getElementById("add-grocery-btn");
const groceryList = document.getElementById("grocery-list");

async function addGroceryItem() {
    const item = groceryInput.value.trim();
    if (item === "") return;
    
    try {
        await addDoc(collection(db, "groceryItems"), { name: item });
        groceryInput.value = "";
        fetchGroceryList();
    } catch (error) {
        console.error("Error adding grocery item:", error);
    }
}

async function fetchGroceryList() {
    groceryList.innerHTML = "";
    try {
        const querySnapshot = await getDocs(collection(db, "groceryItems"));
        querySnapshot.forEach((doc) => {
            const li = document.createElement("li");
            li.textContent = doc.data().name;
            groceryList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching grocery list:", error);
    }
}

// Event Listeners
if (addGroceryBtn) {
    addGroceryBtn.addEventListener("click", addGroceryItem);
    fetchGroceryList();
}

// Authentication state listener (Protect pages if needed)
onAuthStateChanged(auth, (user) => {
    if (window.location.pathname.includes("dashboard.html") && !user) {
        window.location.href = "login.html";
    }
});

// Logout function
window.logout = async function () {
    try {
        await signOut(auth);
        console.log("User logged out");
        alert("Logged out successfully!");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error logging out:", error);
        alert(error.message);
    }
};
