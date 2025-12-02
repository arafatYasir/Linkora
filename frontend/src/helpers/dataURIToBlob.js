const parseURI = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const base64 = reader.result;
            const mimeType = base64.split(";")[0].split(":")[1];
            const uri = base64.split(",")[1];

            resolve({ uri, mimeType });
        }

        reader.readAsDataURL(file);

        reader.onerror = reject;
    })
}

const dataURIToBlob = async (file) => {
    const { uri, mimeType } = await parseURI(file);

    let byteString = atob(uri);
    let ia = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeType });
}

export default dataURIToBlob;