import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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

// Function to handle sign-up
window.signUp = async function (email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);
        alert("Account created! Redirecting to login...");
        window.location.href = "login.html"; // Redirect to login page
    } catch (error) {
        console.error("Error signing up:", error.message);
        document.getElementById("signup-error").innerText = error.message; // Show error message
    }
};

// Function to handle login
window.login = async function (email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        alert("Login successful! Redirecting to dashboard...");
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } catch (error) {
        console.error("Error logging in:", error.message);
        document.getElementById("login-error").innerText = error.message; // Show error message
    }
};

// Function to handle logout
window.logout = async function () {
    try {
        await signOut(auth);
        console.log("User logged out");
        alert("Logged out successfully!");
        window.location.href = "index.html"; // Redirect to home
    } catch (error) {
        console.error("Error logging out:", error.message);
        alert("Error logging out: " + error.message);
    }
};

// Authentication state listener (Protect dashboard.html)
onAuthStateChanged(auth, (user) => {
    if (window.location.pathname.includes("dashboard.html")) {
        if (!user) {
            window.location.href = "login.html"; // Redirect if not logged in
        }
    }
});
