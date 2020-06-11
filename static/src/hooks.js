import {
    useState,
    useEffect,
} from 'react';

export function useImageList({ page }) {
    const [isLoading, updateIsLoading] = useState(false);
    const [images, updateImages] = useState({});
    useEffect(() => {
        updateIsLoading(true);
        fetch(`https://picsum.photos/v2/list?page=${page}&limit=50`)
            .then(response => response.json())
            .then(data => {
                updateImages({
                    ...images,
                    ...{
                        [page]: data.map(item => item.id)
                    },
                });
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                updateIsLoading(false);
            })
    }, [page, updateImages, updateIsLoading]);
    return [isLoading, images];
}
