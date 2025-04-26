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

    async deleteImages(ids: string[]): Promise<void> {
        const userSession = this.auth.getUserSession();
        
        // Extrair apenas os IDs das URLs
        const imageIds = ids.map(url => {
            // Pega a última parte da URL (o UUID)
            const parts = url.split('/');
            return parts[parts.length - 1];
        });

        console.log("IDs extraídos para deleção:", imageIds);

        const response = await fetch(`${this.baseURL}`, {
            method: 'DELETE',
            body: JSON.stringify(imageIds), // Envia a lista de IDs das imagens para deletar
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${userSession?.accessToken}`,
            }
        });

        if (!response.ok) {
            console.error("Status da resposta:", response.status);
            const errorText = await response.text();
            console.error("Corpo da resposta:", errorText);
            throw new Error(`Erro ao deletar as imagens: ${response.status} ${errorText}`);
        }
    }
}

// using react hook -: useFunctionName
export const useImageService = () => new ImageService();