'use client'

import { Template, ImageCard, Button, InputText, useNotification, AuthenticatedPage } from '@/components'
import { Image } from '@/resources/image/image.resource'
import { useImageService } from '@/resources'
import { useState } from 'react'
import Link from 'next/link'
import { Modal } from '@/components/Modal'

export default function GaleryPage(){

    const useService = useImageService();
    const notification = useNotification();
    const [images, setImages] = useState<Image[]>([])
    const [query, setQuery] = useState<string>('')
    const [extension, setExtension] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [selectingMode, setSelectingMode] = useState<boolean>(false)
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
    
    async function searchImages(){
        setLoading(true)
        const result = await useService.search(query, extension);
        setImages(result);
        setLoading(false)

        if(!result.length){
            notification.notify('No results found!', 'warning');
        }
    }

    function toggleSelectingMode(){
        setSelectingMode(prev => !prev);
        setSelectedImages(new Set()); // limpa seleção ao entrar/sair do modo
    }

    // Essa função é chamada quando checkbox de uma imagem é clicado.
    function toggleSelectImage(imageUrl: string) {
        setSelectedImages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(imageUrl)) {
                newSet.delete(imageUrl); // desmarca a imagem
            } else {
                newSet.add(imageUrl); // marca a imagem no checkbox
            }
            return newSet;
        });
    }

    function confirmDeletion() {
        setShowConfirmModal(true);
    }

    async function deleteSelectedImages() {
        setShowConfirmModal(false);
        setLoading(true);

        // Aqui, chamar o serviço para deletar as imagens, converte o set em um array.
        await useService.deleteImages(
            Array.from(selectedImages).filter((url): url is string => !!url)
          );
        
        // Atualizar a lista removendo as deletadas
        setImages(prev => prev.filter(img => img.url && !selectedImages.has(img.url)));
        setSelectedImages(new Set());
        setSelectingMode(false);
        setLoading(false);

        notification.notify('Images deleted successfully!', 'success');
    }

    function renderImageCard(image: Image) {
        const isSelected = image.url ? selectedImages.has(image.url) : false;

        return (
            <div key={image.url} className="relative">
                {selectingMode && (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                            if (image.url) {
                                toggleSelectImage(image.url);
                            }
                        }}
                        className="absolute top-2 left-2 w-5 h-5"
                    />
                )}
                <ImageCard
                    name={image.name}
                    src={image.url}
                    size={image.size}
                    extension={image.extension}
                    uploadDate={image.uploadDate}
                />
            </div>
        )
    }

    function renderImageCards(){
        return images.map(renderImageCard)
    }

    return(
        <AuthenticatedPage>
            <Template loading={loading}>
                <section className="flex flex-col items-center justify-center my-5">
                    <div className="flex space-x-4">
                        <InputText placeholder="Type name or tag" onChange={event => setQuery(event.target.value)}/>
                        <select onChange={event => setExtension(event.target.value) }className="border px-4 py-2 rounded-lg text-gray-900">
                            <option value="">All formats</option>
                            <option value="PNG">PNG</option>
                            <option value="JPEG">JPEG</option>
                            <option value="GIF">GIF</option>

                        </select>
                        <Button style= 'bg-blue-500 hover:bg-blue-300 text-white' label= 'Search' onClick={searchImages}/>
                        <Link href="/form">
                        <Button style= 'bg-green-500 hover:bg-green-300 text-white' label= 'Add new'/>
                        </Link>

                        <Button style='bg-red-500 hover:bg-red-300 text-white' label={selectingMode ? 'Cancel' : 'Delete'} onClick={toggleSelectingMode} />

                        {selectingMode && selectedImages.size > 0 && (
                            <Button style='bg-yellow-500 hover:bg-yellow-300 text-white' label='OK' onClick={confirmDeletion} />
                        )}


                    </div>
                </section>

                <section className='grid grid-cols-3 gap-8'>
                {
                    renderImageCards()
                }
                </section>

                {showConfirmModal && (
                    <Modal
                        title="Confirm deletion"
                        message="Are you sure you want to delete the selected images?"
                        onConfirm={deleteSelectedImages}
                        onCancel={() => setShowConfirmModal(false)}
                    />
                )}
                
            </Template>
        </AuthenticatedPage>
    )
}