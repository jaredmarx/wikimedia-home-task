// Function to fetch the damaging score for a given Wikipedia revision ID
export const fetchDamagingScore = async (revId: number): Promise<number> => {
    // Perform a POST request to the Wikimedia API's damaging score prediction endpoint
    const response = await fetch('https://api.wikimedia.org/service/lw/inference/v1/models/enwiki-damaging:predict', {
        method: 'POST', // Specify the request method as POST
        headers: {
            'Content-Type': 'application/json', // Set the request content type to JSON
        },
        // Include the revision ID in the request body, serialized as a JSON string
        body: JSON.stringify({ rev_id: revId }),
    });

    // Check if the response is not OK (e.g., status code is not in the range 200-299)
    if (!response.ok) {
        // Return 0 as the default damaging score if the response is not OK
        return 0;
    }

    // Parse the response body as JSON
    const data = await response.json();
    // Extract the damaging score probability from the parsed data
    const probability = data.enwiki.scores[revId]?.damaging?.score?.probability?.true;
    // Return the damaging score probability, or 0 if it is undefined
    return probability || 0;
};
