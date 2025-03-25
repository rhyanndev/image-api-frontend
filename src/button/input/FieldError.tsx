interface FieldErrorProps {
    error: any | null;
    style?: string
}

export const FieldError: React.FC<FieldErrorProps> = ({
    error, style
}) => {

    if(error){
        return (
            <span className={`${style} text-sm`}>{error}</span>
        )
    }

    return false;

}