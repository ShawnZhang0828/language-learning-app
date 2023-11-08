import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import { auth, database } from "./FirebaseController";

const getAllFavourites = async () => {
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const userRef = database.collection("favourites").doc(userId);

    try {
      const docSnapshot = await userRef.get();
      if (docSnapshot.exists) {
        var favourites = docSnapshot.data();

        var chat = favourites["chat"];
        var culture = favourites["culture"];
        var grammar = favourites["grammar"];
        var phrasebook = favourites["phrasebook"];

        return {
          status: 1,
          chat: chat,
          culture: culture,
          grammar: grammar,
          phrasebook: phrasebook,
        };
      } else {
        throw new Error(`${userId} document does not exist.`);
      }
    } catch (error) {
      console.error("Error getting all vocabulary: ", error);
      return { status: 0, message: `Error getting all vocabulary: ${error}` };
    }
  } else {
    const message = "user does not exist";
    console.error(message);
    return { status: 0, message: message };
  }
};

export { getAllFavourites };
