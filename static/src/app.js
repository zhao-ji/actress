import React from 'react';
import { useState, useEffect } from 'react';

import { useImageList } from './hooks';
import { Photo } from './components';

function App() {
  const [anchor, updateAnchor] = useState(null);
  const [isLoading, images] = useImageList({ anchor });
  let lastKey = images && images.length > 0 && images[images.length - 1].Key;
  useEffect(() => {
      const scrollCheck = () => {
          const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
          const body = document.body;
          const html = document.documentElement;
          const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
          const windowBottom = windowHeight + window.pageYOffset;
          if (windowBottom >= docHeight) {
              console.log('touch the bottom--------------------')
              updateAnchor(lastKey);
          }
      }
      window.addEventListener('scroll', scrollCheck);
      console.log('111111111111111111111')
      return () => {
          console.log('==================')
          window.removeEventListener('scroll', scrollCheck)
      };
  }, [lastKey, updateAnchor]);
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
