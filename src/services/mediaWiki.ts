// Function to fetch the rendered diff of a Wikipedia article's revision
export const fetchRenderedDiff = async (title: string, revisionId: number) => {
    // Making a fetch request to the Wikipedia API to compare revisions
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=compare&fromrev=${revisionId}&torelative=prev&format=json`);
    // Parsing the response as JSON
    const data = await response.json();
    // Returning the parsed data
    return data;
};

