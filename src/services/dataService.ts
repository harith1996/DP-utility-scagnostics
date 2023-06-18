//specifies the host of the backend server
const HOST = "http://localhost:5000";

const buildFileNameFromParams = (params: any) => {
    let parts = Object.values(params)
    return parts.join('_') + ".csv";

}

//get list of datasets of specified type
export const getDatasets = async (type: string) => {
	const response = await fetch(`${HOST}/datasets/${type}`);
	return await response.json() as string[];
};

//get list of available attributes
export const getAttributes = async () => {
	const response = await fetch(`${HOST}/attributes`);
	return await response.json() as string[];
};

//get filter params
export const getFilterParams = async () => {
	const response = await fetch(`${HOST}/filterParams`);
	return await response.json() as string[];
};

//get unique values of each attribute
export const getUniqueValues = async (attribute: string) => {
	const response = await fetch(`${HOST}/attributes/unique/${attribute}`);
	return await response.json() as string[];
};

//get a specific dataset
export const getDataset = async (type: string, filename: string) => {
	const response = await fetch(`${HOST}/datasets/${type}/${filename}`);
	return await response.json();
};

export const getPrivateData = async (params:any) => {
    const filename = buildFileNameFromParams(params);
    return getDataset("private", filename);
}
