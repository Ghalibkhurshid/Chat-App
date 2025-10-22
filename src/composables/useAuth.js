import { ref } from 'vue';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { ref as dbRef, set, update, onDisconnect } from "firebase/database";
import { database } from "../firebase";

const user = ref(null);
const loading = ref(true);

export function useAuth() {
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedInUser = userCredential.user;

            // ✅ Update online status
            await update(dbRef(database, `users/${loggedInUser.uid}`), { online: true });

            return { success: true, user: loggedInUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };


    const register = async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;
            await updateProfile(newUser, { displayName });

            // ✅ Save to Realtime Database
            await set(dbRef(database, `users/${newUser.uid}`), {
                displayName,
                email,
                online: true,
                createdAt: Date.now(),
            });

            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            const uid = auth.currentUser?.uid;
            if (uid) {
                await update(dbRef(database, `users/${uid}`), { online: false, lastSeen: Date.now() });
            }
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };


    onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
        loading.value = false;
    });

    return {
        user,
        loading,
        login,
        register,
        logout
    };
}
