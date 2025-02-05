'use client'

interface FirstComponentProps {
    message?: string;
    buttonMessage: string;

}

export const FirstComponent: React.FC<FirstComponentProps> = (props: FirstComponentProps) => {

    function handleClick(){
        console.log(props.buttonMessage)
    }

    return (
        <div>
            {props.message}
            <button onClick={handleClick}>Click Here</button>
        </div>
    )
}

export const ArrowFunction = () => {
    return (
        <h2>Arrow Function</h2>
    )
}










