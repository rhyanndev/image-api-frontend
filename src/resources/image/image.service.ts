import { Image } from './image.resource'
import { useAuth } from '@/resources'

//API's calls
class ImageService {
    baseURL: string = 'http://localhost:8080/v1/images';
    auth = useAuth();

    // array for search images in URL
    async search(query: string = "", extension: string = "") : Promise<Image[]> {
        const userSession = this.auth.getUserSession();
        const url = `${this.baseURL}?query=${query}&extension=${extension}`
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${userSession?.accessToken}`
            }
        });
        return await response.json();
    }

    async save(dados: FormData) : Promise<string> {
        const userSession = this.auth.getUserSession();
        const response = await fetch(this.baseURL, {
            method: 'POST',
            body: dados,
            headers: {
                "Authorization": `Bearer ${userSession?.accessToken}`
            }
        })

        return response.headers.get('location') ?? ''
    }
}

// using react hook -: useFunctionName
export const useImageService = () => new ImageService();