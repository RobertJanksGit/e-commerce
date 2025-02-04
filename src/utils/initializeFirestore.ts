import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, sampleProducts } from "../firebase";

export const initializeFirestore = async () => {
  try {
    // Check if products already exist
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(
      query(productsRef, where("name", "==", sampleProducts[0].name))
    );

    if (querySnapshot.empty) {
      // Add sample products to Firestore
      for (const product of sampleProducts) {
        await addDoc(collection(db, "products"), product);
      }
      console.log("Sample products added to Firestore");
    } else {
      console.log("Products already exist in Firestore");
    }
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
};
