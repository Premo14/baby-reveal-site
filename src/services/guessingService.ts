import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, Unsubscribe } from "firebase/firestore";

const COLLECTION_NAME = "guesses";
const LOCAL_STORAGE_KEY = "mock_guesses";

export interface Guess {
    id?: string;
    name: string;
    gender: "boy" | "girl";
    timestamp: Date;
}

const isMockMode = () => {
    return !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your-api-key";
};

// Helper: Get local guesses
const getLocalGuesses = (): Guess[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const addGuess = async (name: string, gender: "boy" | "girl") => {
    try {
        if (isMockMode()) {
            console.log("Mock Mode: Saving to LocalStorage");
            const newGuess: Guess = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                gender,
                timestamp: new Date()
            };
            const current = getLocalGuesses();
            const updated = [...current, newGuess];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

            // Dispatch a custom event so the listener can pick it up immediately
            window.dispatchEvent(new Event("local-storage-update"));
            return;
        }

        await addDoc(collection(db, COLLECTION_NAME), {
            name,
            gender,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Error adding guess:", error);
        throw error;
    }
};

export const subscribeToGuesses = (callback: (guesses: Guess[]) => void): Unsubscribe => {
    if (isMockMode()) {
        console.log("Mock Mode: Subscribing to LocalStorage");

        const loadLocal = () => {
            const guesses = getLocalGuesses();
            callback(guesses);
        };

        // Initial load
        loadLocal();

        // Listen for updates from the same window
        window.addEventListener("local-storage-update", loadLocal);
        // Listen for updates from other tabs
        window.addEventListener("storage", loadLocal);

        return () => {
            window.removeEventListener("local-storage-update", loadLocal);
            window.removeEventListener("storage", loadLocal);
        };
    }

    const q = query(collection(db, COLLECTION_NAME));
    return onSnapshot(q, (snapshot) => {
        console.log("[DEBUG] Real-time update received!", snapshot.size, "records");
        const guesses = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Guess[];
        callback(guesses);
    });
};
