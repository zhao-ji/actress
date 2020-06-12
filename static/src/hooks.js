import {
    useState,
    useEffect,
} from 'react';

export function useImageList({ anchor }) {
    const [isLoading, updateIsLoading] = useState(false);
    const [images, updateImages] = useState([]);
    useEffect(() => {
        console.log(anchor, updateImages, updateIsLoading)
        updateIsLoading(true);
        const param = anchor ? `&fromKey=${anchor}` : "";
        fetch("https://api.article.minganci.org/actress/?limit=100" + param)
            .then(response => response.json())
            .then(data => {
                updateImages([
                    ...images,
                    ...data,
                ]);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                updateIsLoading(false);
            })
    }, [anchor, updateImages, updateIsLoading]);
    return [isLoading, images];
}
