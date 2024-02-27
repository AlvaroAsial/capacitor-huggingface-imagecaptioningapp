const API_TOKEN = '';

const fetchImageCaption = async (imageUri) => {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
            {
                headers: { Authorization: `Bearer ${API_TOKEN}` },
                method: "POST",
                body: imageUri,
            }
        );
        if (response.status !== 200) {
            throw "Incorrect request."
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching image caption:', error);
        throw error;
    }
};

export default fetchImageCaption;