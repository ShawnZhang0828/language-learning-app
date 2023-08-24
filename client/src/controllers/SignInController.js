import { auth, database } from '../controllers/FirebaseController';

//TODO: Set up database when user creates accounts

const signInWithEmailAndPassword = async (email, password) => {
    try {
        await auth.signInWithEmailAndPassword(email, password);

        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const userRef = database.collection("preference").doc(userId);
    
            // Fetch user preference and return to sign in page (will be used to create preference context)
            try {
                const docSnapshot = await userRef.get();
                if (docSnapshot.exists) {
                    var preferences = docSnapshot.data();
                    
                    console.log(`Successfully fetched preferences from database: ${preferences}`);
                    return preferences;
                } else {
                    throw new Error(`${userId} document does not exist.`);
                }
            }
            catch(error) {
                console.error("Error getting all vocabulary: ", error);
                return {};
            }
        } else {
            console.error("user does not exist");
            return {};
        }
    } catch(error) {
        console.error("Error happened when signing in", error);
        return {};
    }
 };

 export {signInWithEmailAndPassword};