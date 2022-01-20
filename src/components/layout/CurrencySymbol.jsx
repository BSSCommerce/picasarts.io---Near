import Image from 'next/image';

const myLoader = ({ src, width, quality }) => {
    return `/${src}?w=${width}&q=${quality || 75}`
}

export const CurrencySymbol = ({url}) => {
    return (
        <Image
            loader={myLoader}
            src={url}
            alt="Picture of the author"
            width={500}
            height={500}
        />
    )
}