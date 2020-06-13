import React from 'react';
import { useState, useEffect } from 'react';

import { Photo } from './components';

const apiUrl = "https://api.article.minganci.org/actress/?limit=100";

function App() {
    const [isLoading, updateIsLoading] = useState(false);
    const [images, updateImages] = useState([]);
    useEffect(() => {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => updateImages([...data]))
            .catch(error => console.log(error))
            .finally(() => updateIsLoading(false))
    }, [updateIsLoading, updateImages]);
    useEffect(() => {
        let anchor = images && images.length > 0 && images[images.length - 1].Key;
        const scrollCheck = () => {
            const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            const body = document.body;
            const html = document.documentElement;
            const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            const windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight) {
                const param = anchor ? `&fromKey=${anchor}` : "";
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
        <div id="gallary">
            {
                images.map(image => <Photo image={image} key={image.ETag} />)
            }
        </div>
        {
            isLoading && <p>Loading...</p>
        }
      </div>
    );
}

export default App;
