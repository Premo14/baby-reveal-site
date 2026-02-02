import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, runTransaction, setDoc, getDoc } from "firebase/firestore";

const GUESSES_COLLECTION = "guesses";
const STATS_DOC_PATH = "stats/counts";
const LOCAL_STORAGE_KEY = "mock_guesses";

export interface Guess {
    id?: string;
    name: string;
    gender: "boy" | "girl";
    timestamp: Date;
}

export interface Counts {
    boy: number;
    girl: number;
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

        // Real Mode: Use Transaction to securely increment count + save guess
        await runTransaction(db, async (transaction) => {
            const statsRef = doc(db, STATS_DOC_PATH);
            const statsDoc = await transaction.get(statsRef);

            let newCounts: Counts = { boy: 0, girl: 0 };

            if (statsDoc.exists()) {
                newCounts = statsDoc.data() as Counts;
            }

            // 1. Increment the counter locally
            newCounts[gender]++;

            // 2. Create a reference for the new guess
            const newGuessRef = doc(collection(db, GUESSES_COLLECTION));

            // 3. Write updates
            transaction.set(statsRef, newCounts);
            transaction.set(newGuessRef, {
                name,
                gender,
                timestamp: new Date()
            });
        });

    } catch (error) {
        console.error("Error adding guess:", error);
        throw error;
    }
};

export const subscribeToStats = (callback: (counts: Counts) => void): () => void => {
    if (isMockMode()) {
        console.log("Mock Mode: Subscribing to LocalStorage Stats");

        const loadLocalStats = () => {
            const guesses = getLocalGuesses();
            const counts = guesses.reduce((acc, curr) => {
                acc[curr.gender]++;
                return acc;
            }, { boy: 0, girl: 0 });
            callback(counts);
        };

        // Initial load
        loadLocalStats();

        // Listen for updates from the same window
        window.addEventListener("local-storage-update", loadLocalStats);
        // Listen for updates from other tabs
        window.addEventListener("storage", loadLocalStats);

        return () => {
            window.removeEventListener("local-storage-update", loadLocalStats);
            window.removeEventListener("storage", loadLocalStats);
        };
    }

    // Real Mode: Listen to the single Stats document
    const statsRef = doc(db, STATS_DOC_PATH);
    return onSnapshot(statsRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data() as Counts);
        } else {
            // If doc doesn't exist yet, assume 0/0
            callback({ boy: 0, girl: 0 });
        }
    });
};
