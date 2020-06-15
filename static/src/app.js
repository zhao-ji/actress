import React from 'react';
import { useState, useEffect } from 'react';

import { Photo, ImgModal } from './components';
import { touchBottom, apiUrl } from './utils';

function App() {
    const [isLoading, updateIsLoading] = useState(false);
    const [images, updateImages] = useState([]);
    const [image, setImage] = useState(null);
    useEffect(() => {
        updateIsLoading(true);
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => updateImages([...data]))
            .catch(error => console.log(error))
            .finally(() => updateIsLoading(false))
    }, [updateIsLoading, updateImages]);
    useEffect(() => {
        let anchor = images && images.length > 0 && images[images.length - 1].Key;
        const scrollCheck = () => {
            if (touchBottom()) {
                const param = anchor ? `&fromKey=${anchor}` : "";
                updateIsLoading(true);
                fetch(apiUrl + param)
                    .then(response => response.json())
                    .then(data => {
                        updateImages([...images, ...data]);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        updateIsLoading(false);
                    })
            }
        }
        window.addEventListener('scroll', scrollCheck);
        return () => {
            window.removeEventListener('scroll', scrollCheck)
        };
    }, [images, updateImages, updateIsLoading]);
    return (
        <div id="App">
            <header className="App-header">
                <p>
                    Life recording and photo gallery
                </p>
            </header>
            <ImgModal image={image} setImage={setImage} />
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
