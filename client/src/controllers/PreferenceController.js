import { auth, database } from './SignInController';

const preferences = {
    "reason": {
        text: "Reason To Learn",
        options: [
            {value: "Travel", icon: "/preference-icons/travel.png"},
            {value: "Study", icon: "/preference-icons/study.png"},
            {value: "Work", icon: "/preference-icons/work.png"},
            {value: "Professional", icon: "/preference-icons/professional.png"},
            {value: "Interest", icon: "/preference-icons/interest.png"},
        ]
    },
    "target language": {
        text: "Target Language",
        options: [
            {value: "Chinese", icon: "/preference-icons/chinese.png"},
            {value: "English", icon: "/preference-icons/english.png"},
            {value: "Spanish", icon: "/preference-icons/spanish.png"},
            {value: "Japanese", icon: "/preference-icons/japanese.png"},
            {value: "Korean", icon: "/preference-icons/korean.png"},
            {value: "Franch", icon: "/preference-icons/franch.png"},
            {value: "German", icon: "/preference-icons/german.png"},
        ]
    },
    "level": {
        text: "Current Level",
        options: [
            {value: "Beginner", icon: "/preference-icons/beginner.png"},
            {value: "Elementary", icon: "/preference-icons/elementary.png"},
            {value: "Intermediate", icon: "/preference-icons/intermediate.png"},
            {value: "Upper-Intermediate", icon: "/preference-icons/upper-intermediate.png"},
            {value: "Advanced", icon: "/preference-icons/advanced.png"},
            {value: "Proficient User", icon: "/preference-icons/proficient-user.png"},
        ]
    }
}

const updatePreference = (prefName, value) => {
    //TODO: handle null selection
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        const userRef = database.collection("preference").doc(userId);

        prefName = prefName.toString();

        var validOptions = preferences[prefName.toLowerCase()].options.map(option => option.value.toLowerCase());
        if (!validOptions.includes(value.toString().toLowerCase())) {
            throw new Error(`Invalid value for preference: ${prefName} - ${value}`);
        }
        userRef.update({
            prefName: value
        })
        .then(() => {
            console.log(`Updated preference ${prefName} - ${value}`);
        })
        .catch((error) => {
            console.log(`Error updating preference: ${error}`);
        });
    }
}

export { updatePreference, preferences };