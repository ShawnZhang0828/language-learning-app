import { auth, database } from "../controllers/FirebaseController";

// TODO: fix preference naming
const signUpWithEmailAndPassword = async (user) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );
    console.log(`Sign up ${user.email} successfully.`);

    const registeredUser = userCredential.user;

    if (registeredUser) {
      const vocabularyRef = database.collection("vocabulary").doc(registeredUser.uid);
      const preferenceRef = database.collection("preference").doc(registeredUser.uid);
      const favouriteRef = database.collection("favourites").doc(registeredUser.uid);
      const grammarRef = database.collection("grammar").doc(registeredUser.uid);

      await preferenceRef.set({
        "dark mode": false,
        level: user.level,
        "original language": user.originalLang,
        reason: user.reason,
        "target language": user.targetLang,
      });

      await vocabularyRef.set({
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
      });

      await favouriteRef.set({
        chat: [],
        culture: [],
        grammar: [],
        phrasebook: [],
      });

      await grammarRef.set({
        grammars: []
      })

      console.log(`Initialize ${user.email} database successfully.`);
    }

    return { status: 1, message: "Sign up successfully." };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log("This email address is already in use!");
      return { status: -1, message: "This email has already been registered." };
    } else {
      console.error("Error initializing user: ", error);
      return { status: 0, message: "We encountered an error when signing up." };
    }
  }
};

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

          console.log(
            `Successfully fetched preferences from database: ${preferences}`
          );
          return preferences;
        } else {
          throw new Error(`${userId} document does not exist.`);
        }
      } catch (error) {
        console.error("Error getting all vocabulary: ", error);
        return {};
      }
    } else {
      console.error("user does not exist");
      return {};
    }
  } catch (error) {
    console.error("Error happened when signing in", error);
    return {};
  }
};

auth.onAuthStateChanged((user) => {});

export { signUpWithEmailAndPassword, signInWithEmailAndPassword };
