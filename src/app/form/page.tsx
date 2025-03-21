'use client'

import { InputText, Template, Button, RenderIf, useNotification, FieldError } from '@/components'
import { useImageService } from '@/resources/image/image.service'
import { useFormik } from 'formik'
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FormProps, formScheme, formValidationScheme } from './formScheme'
import Link from 'next/link'

export default function FormPage(){

    const [loading, setLoading] = useState<boolean>(false)
    const [imagePreview, setImagePreview] = useState<string>();
    const service = useImageService();
    const notification = useNotification();

    const formik = useFormik<FormProps>({
        initialValues: formScheme,
        onSubmit: handleSubmit,
        validationSchema: formValidationScheme
    })

    async function handleSubmit(dados: FormProps) {

        setLoading(true);

        const formData = new FormData();
        formData.append("file", dados.file);
        formData.append("name", dados.name);
        formData.append("tags", dados.tags);

        await service.save(formData);

        formik.resetForm();
        setImagePreview('')

        setLoading(false);

        notification.notify('Upload sent successfully!', 'success');
    }

    function onFileUpload(event: React.ChangeEvent<HTMLInputElement>){
        if(event.target.files){
            const file = event.target.files[0]
            formik.setFieldValue("file", file)
            const imageURL = URL.createObjectURL(file)
            setImagePreview(imageURL)
        }
    }

    return(
        <Template loading={loading}>
            <section className='flex flex-col items-center justify-center my-5'>
                <h5 className='mt-3 mb-10 text-3xl font-extrabold tracking-tight text-gray-900'>New Image</h5>
                    <form onSubmit={formik.handleSubmit}>
                        <div className='grid grid-cols-1'>
                            <label className='block text-sm font-medium leading-6 text-gray-700'>Name: *</label>
                            <InputText
                                id="name"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                placeholder="type the image"/>
                                <FieldError error={formik.errors.name}/>
                        </div>

                        <div className='mt-5 grid grid-cols-1'>
                            <label className='block text-sm font-medium leading-6 text-gray-700'>Tags: *</label>
                            <InputText 
                                id="tags"
                                onChange={formik.handleChange}
                                value={formik.values.tags}
                                placeholder="type the tags comma separated"/>
                                <FieldError error={formik.errors.tags}/>
                        </div>

                        <div className='mt-5 grid grid-cols-1'>
                            <label className='block text-sm font-medium leading-6 text-gray-700'>Image: *</label>
                            <FieldError error={formik.errors.file}/>
                            <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
                            <div className='text-center text-gray-700'>
                                <RenderIf condition={!imagePreview}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 m-auto">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </RenderIf>
                                <div className='mt-4 flex text-sm leading-6 text-gray-600'>
                                    <label className='relative cursor-pointer rounded-md font-semibold text-indigo-600'>
                                        <RenderIf condition={!imagePreview}>
                                            <span>Click to upload</span>
                                        </RenderIf>

                                        <RenderIf condition={!!imagePreview}>
                                            <img src={imagePreview} width={250} className='rounded-md'/>
                                        </RenderIf>

                                        <input onChange={onFileUpload} type='file' className='sr-only'></input>
                                    </label>
                                </div>
                            </div>

                            </div>

                        </div>

                        <div className='mt-5 flex items-center justify-end gap-x-6'>
                            <Button style='bg-blue-500 hover:bg-blue-300 text-white' type='submit' label='Save' />
                            <Link href="/gallery">
                                <Button style='bg-red-500 hover:bg-red-300 text-white' type='button' label='Cancel' />

                            </Link>
                        </div>

                    </form>
            </section>
        </Template>
    )
}