import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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

// Function to handle sign-up
window.signUp = function (email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed up:", userCredential.user);
            alert("Account created! Redirecting to login...");
            window.location.href = "login.html";
        })
        .catch((error) => {
            console.error("Error signing up:", error.message);
            document.getElementById("signup-error").innerText = error.message;
        });
};

// Function to handle login
window.login = function (email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User logged in:", userCredential.user);
            alert("Login successful! Redirecting to dashboard...");
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
            document.getElementById("login-error").innerText = error.message;
        });
};

// Function to handle logout
window.logout = function () {
    signOut(auth)
        .then(() => {
            console.log("User logged out");
            alert("Logged out successfully!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error logging out:", error.message);
            alert(error.message);
        });
};

// Authentication state listener
onAuthStateChanged(auth, (user) => {
    if (window.location.pathname.includes("dashboard.html")) {
        if (!user) {
            window.location.href = "login.html";
        }
    }
});

// Grocery List Functions
window.addGroceryItem = async function () {
    const itemInput = document.getElementById("grocery-item");
    const itemName = itemInput.value.trim();
    if (!itemName) return;
    
    try {
        await addDoc(collection(db, "grocery-list"), { name: itemName });
        console.log("Item added:", itemName);
        itemInput.value = "";
        fetchGroceryList();
    } catch (error) {
        console.error("Error adding grocery item:", error);
    }
};

window.fetchGroceryList = async function () {
    const listContainer = document.getElementById("grocery-list");
    listContainer.innerHTML = "";
    
    const querySnapshot = await getDocs(collection(db, "grocery-list"));
    querySnapshot.forEach((doc) => {
        const listItem = document.createElement("li");
        listItem.textContent = doc.data().name;
        listContainer.appendChild(listItem);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("grocery-list")) {
        fetchGroceryList();
    }
});
