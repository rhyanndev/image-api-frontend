import { ToastContainer } from 'react-toastify'

import React from "react"
import { Loading } from '@/components/Loading';

interface TemplateProps {
    children: React.ReactNode;
    loading?: boolean;
}

export const Template: React.FC<TemplateProps> = ({ children, loading = false }: TemplateProps) => {
    return (
        <>

            <Header />

            <div className={`${loading ? 'animate-pulse' : ''} container mx-auto mt-8 px-4`}>
               <RenderIf condition={loading}>
                <div className="text-center">
                    <Loading />
                </div>
                
               </RenderIf>
                { children }
            </div>

            <Footer />
            <ToastContainer position='top-right'
                            autoClose={8000}
                            hideProgressBar={false}
                            draggable={false}
                            closeOnClick={true}
                            pauseOnHover={true}
            />

        </>
    )
}

interface RenderIfProps {
    condition?: boolean;
    children: React.ReactNode;
}

export const RenderIf: React.FC<RenderIfProps> = ({condition = true, children}) => {

    if(condition){
        return children
    }

    return false;

}

const Header: React.FC = () => {
    return (
        <header className="bg-slate-700 text-white py-3">
            <div className="container mx-auto flex justify-between items-center px-4">
                <h1 className="text-3xl font-bold">ImageLite</h1>

            </div>

        </header>
    )
}

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-700 text-white py-4 mt-8">
            <div className="container mx-auto text-center">
            </div>

        </footer>
    )
}