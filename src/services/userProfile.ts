import { db, storage } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth } from "../firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  shippingAddresses?: {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }[];
  preferences?: {
    notifications?: boolean;
    newsletter?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "userProfiles", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    const docRef = doc(db, "userProfiles", uid);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const createUserProfile = async (
  uid: string,
  email: string
): Promise<void> => {
  try {
    const docRef = doc(db, "userProfiles", uid);
    const now = new Date();
    await setDoc(docRef, {
      uid,
      email,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserOrders = async (uid: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const addShippingAddress = async (
  uid: string,
  address: Omit<NonNullable<UserProfile["shippingAddresses"]>[0], "id">
): Promise<void> => {
  try {
    let profile = await getUserProfile(uid);

    // If profile doesn't exist, create it
    if (!profile) {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      await createUserProfile(uid, user.email || "");
      profile = await getUserProfile(uid);
      if (!profile) throw new Error("Failed to create user profile");
    }

    const newAddress = {
      ...address,
      id: crypto.randomUUID(),
    };

    const addresses = profile.shippingAddresses || [];
    if (address.isDefault) {
      addresses.forEach((addr) => (addr.isDefault = false));
    }

    await updateUserProfile(uid, {
      shippingAddresses: [...addresses, newAddress],
    });
  } catch (error) {
    console.error("Error adding shipping address:", error);
    throw error;
  }
};

export const updateShippingAddress = async (
  uid: string,
  addressId: string,
  address: Partial<NonNullable<UserProfile["shippingAddresses"]>[0]>
): Promise<void> => {
  try {
    const profile = await getUserProfile(uid);
    if (!profile) throw new Error("User profile not found");

    const addresses = profile.shippingAddresses || [];
    const index = addresses.findIndex((addr) => addr.id === addressId);
    if (index === -1) throw new Error("Address not found");

    if (address.isDefault) {
      addresses.forEach((addr) => (addr.isDefault = false));
    }

    addresses[index] = {
      ...addresses[index],
      ...address,
    };

    await updateUserProfile(uid, {
      shippingAddresses: addresses,
    });
  } catch (error) {
    console.error("Error updating shipping address:", error);
    throw error;
  }
};

export const uploadProfileImage = async (
  uid: string,
  file: File
): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload an image file (JPEG, PNG, etc.)");
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      throw new Error("Image size should be less than 5MB");
    }

    // Get the file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const filename = `profile-${timestamp}.${fileExtension}`;
    const imagePath = `profile-images/${uid}/${filename}`;

    // Delete existing profile image if it exists
    const profile = await getUserProfile(uid);
    if (profile?.photoURL) {
      try {
        // Extract the old image path from the URL
        const oldImageUrl = new URL(profile.photoURL);
        const oldImagePath = decodeURIComponent(
          oldImageUrl.pathname.split("/o/")[1].split("?")[0]
        );
        const oldImageRef = ref(storage, oldImagePath);
        await deleteObject(oldImageRef);
      } catch (error) {
        console.error("Error deleting old profile image:", error);
        // Continue with upload even if delete fails
      }
    }

    // Upload new image
    const imageRef = ref(storage, imagePath);
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
        userId: uid,
      },
    };

    // Upload the file
    await uploadBytes(imageRef, file, metadata);
    const downloadURL = await getDownloadURL(imageRef);

    // Update profile with new photo URL
    await updateUserProfile(uid, {
      photoURL: downloadURL,
    });

    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to upload profile image: ${error.message}`);
    }
    throw new Error("Failed to upload profile image");
  }
};
