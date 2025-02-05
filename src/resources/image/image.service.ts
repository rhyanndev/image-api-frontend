import { Image } from './image.resource'

//API's calls
class ImageService {
    baseURL: string = 'http://localhost:8080/v1/images';

    // array for search images in URL
    async search(query: string = "", extension: string = "") : Promise<Image[]> {
        const url = `${this.baseURL}?query=${query}&extension=${extension} `
        const response = await fetch(url);
        return await response.json();
    }

    async save(dados: FormData) : Promise<string>{
        const response = await fetch(this.baseURL,{
                method: 'POST',
                body: dados
            })

        return response.headers.get('location') ?? ''
    }
}

// using react hook -: useFunctionName
export const useImageService = () => new ImageService();