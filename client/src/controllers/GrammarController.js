import "firebase/compat/firestore";

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
  
          var rules = rules["grammars"];
  
          return {
            status: 1,
            grammars: rules
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
}

export { getGrammarRules };
