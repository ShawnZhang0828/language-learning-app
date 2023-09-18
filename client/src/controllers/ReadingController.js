import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const requestStory = async (language) => {
    const requestData = {
        language: language
    }

    try {
        const response = await axios.post(`${BACKEND_URL}/reading/story`, requestData);

        console.log(response.data);
        return { status: 1, story: response.data.story }
    } catch(error) {
        console.error("Error requesting story", error);
        return { status: 0, message: "We encountered an error when creating a story." };
    }
}

export { requestStory };