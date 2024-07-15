export const fetchLiftwingMetadata = async (revisionId: number) => {
    const response = await fetch(`https://liftwing.wikimedia.org/api/v1/revision/${revisionId}/metadata`);
    const data = await response.json();
    return data;
};
