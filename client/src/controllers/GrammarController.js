import "firebase/compat/firestore";
import firebase from 'firebase/compat/app';

import { auth, database } from "./FirebaseController";

const getGrammarRules = async () => {
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const userRef = database.collection("grammar").doc(userId);

    try {
      const docSnapshot = await userRef.get();
      if (docSnapshot.exists) {
        var rules = docSnapshot.data();

        var grammarsRules = rules["grammars"];

        return {
          status: 1,
          grammars: grammarsRules,
        };
      } else {
        throw new Error(`${userId} document does not exist.`);
      }
    } catch (error) {
      console.error("Error getting all grammar rules: ", error);
      return { status: 0, message: `Error getting all gammar rules: ${error}` };
    }
  } else {
    const message = "user does not exist";
    console.error(message);
    return { status: 0, message: message };
  }
};

const addGrammarRule = async (grammarElements) => {
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const userRef = database.collection("grammar").doc(userId);

    try {
      const newElement = {
        rule: grammarElements,
        starred: false,
      };

      grammarElements.forEach((element) => console.log(element))

      await userRef.update({
        grammars: firebase.firestore.FieldValue.arrayUnion(newElement)
      })
    } catch (e) {
      return { status: 0, message: `Failed to added grammar - ${e.message}` }
    }
  }

  return { status: 1, message: "Added grammar successfully." }
};

export { getGrammarRules, addGrammarRule };
