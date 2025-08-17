const uploadImage = async (file: any): Promise<{ url: string, id: string }> => {
    const formData = new FormData()
    formData.append('file', file!!)
    formData.append('upload_preset', 'client');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    }).then(async res => {
        const data = await res.json()
        return {
            url: data.url,
            id: data.asset_id
        }
    }).catch(err => {
        console.error('Error uploading image:', err)
        return {
            url: '',
            id: ''
        }
    })
    return res
}


export default uploadImage