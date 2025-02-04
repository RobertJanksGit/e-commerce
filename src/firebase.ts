import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Add sample products to Firestore
export const sampleProducts = [
  {
    name: "Wireless Headphones",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation",
    imageUrl: "https://via.placeholder.com/200",
    rating: 4.5,
    category: "Electronics",
    stock: 50,
  },
  {
    name: "Smartphone",
    price: 699.99,
    description: "Latest model smartphone with advanced features",
    imageUrl: "https://via.placeholder.com/200",
    rating: 4.8,
    category: "Electronics",
    stock: 30,
  },
  {
    name: "Smart Watch",
    price: 199.99,
    description: "Feature-rich smartwatch with health tracking",
    imageUrl: "https://via.placeholder.com/200",
    rating: 4.6,
    category: "Electronics",
    stock: 40,
  },
  {
    name: "Laptop",
    price: 1299.99,
    description: "Powerful laptop for work and gaming",
    imageUrl: "https://via.placeholder.com/200",
    rating: 4.9,
    category: "Electronics",
    stock: 20,
  },
  {
    name: "Wireless Earbuds",
    price: 149.99,
    description: "True wireless earbuds with premium sound quality",
    imageUrl: "https://via.placeholder.com/200",
    rating: 4.7,
    category: "Electronics",
    stock: 60,
  },
];
