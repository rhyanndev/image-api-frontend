import Login from '@/app/login/page';
import { useAuth } from '@/resources';

interface AuthenticatePageProps {
    children: React.ReactNode
}

export const AuthenticatedPage: React.FC<AuthenticatePageProps> = ({
    children
}) => {

    const auth = useAuth();

    if(!auth.isSessionValid()){
        return <Login/>
    }
    
    return (
        <>
            {children}
        </>
    )
}