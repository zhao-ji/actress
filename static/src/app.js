import React from 'react';
import { useState, useEffect } from 'react';

import { Photo, ImgModal } from './components';
import { touchBottom, apiUrl, apiDeleteUrl } from './utils';

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null);
    const clickPrevious = () => {
        const list = images.map(item => item.Key);
        const position = list.indexOf(image.Key);
        if (position >= 1) setImage(images[position - 1]);
    }
    const clickAfter = () => {
        const list = images.map(item => item.Key);
        const position = list.indexOf(image.Key);
        if (position < list.length - 1) setImage(images[position + 1]);
    }
    const clickDelete = () => {
        fetch(apiDeleteUrl + image.Key, { method: 'DELETE' })
            .then(res => res.json())
            .then(res => {
                const list = images.map(item => item.Key);
                const position = list.indexOf(image.Key);
                const newImageList = [...images];
                newImageList.splice(position, 1);
                setImages(newImageList);
                setImage(newImageList[position]);
            })
            .catch(error => console.log(error))
    }
    const closeModal = () => {
        setImage(null);
    }
    useEffect(() => {
        setIsLoading(true);
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => setImages([...data]))
            .catch(error => console.log(error))
            .finally(() => setIsLoading(false));
    }, [setIsLoading, setImages]);
    useEffect(() => {
        let anchor = images && images.length > 0 && images[images.length - 1].Key;
        const scrollCheck = () => {
            if (touchBottom()) {
                const param = anchor ? `&fromKey=${anchor}` : "";
                setIsLoading(true);
                fetch(apiUrl + param)
                    .then(response => response.json())
                    .then(data => {
                        setImages([...images, ...data]);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    })
            }
        }
        window.addEventListener('scroll', scrollCheck);
        return () => window.removeEventListener('scroll', scrollCheck);
    }, [images, setImages, setIsLoading]);
    return (
        <div id="App">
            <header className="App-header">
                <p>
                    Life recording and photo gallery
                </p>
            </header>
            <ImgModal
                {...{
                    image,
                    closeModal,
                    clickPrevious,
                    clickDelete,
                    clickAfter,
                }}
            />
            <div id="gallary">
                {
                    images.map(image => <Photo image={image} setImage={setImage} key={image.ETag} />)
                }
            </div>
            {
                isLoading && <p>Loading...</p>
            }
        </div>
    );
}

export default App;
