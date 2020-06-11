import React from 'react';
import { useState, useEffect } from 'react';

import { useImageList } from './hooks';

function App() {
  const [page, updatePage] = useState(1);
  const [isLoading, images] = useImageList({ page });
  useEffect(() => {
      const scrollCheck = () => {
          const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
          const body = document.body;
          const html = document.documentElement;
          const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
          const windowBottom = windowHeight + window.pageYOffset;
          if (windowBottom >= docHeight) {
              updatePage(page + 1);
          }
      }
      window.addEventListener('scroll', scrollCheck);
      return () => window.removeEventListener('scroll', scrollCheck);
  }, [page, updatePage]);
  return (
    <div id="App">
      <header className="App-header">
        <p>
            Life recording and photo gallery
        </p>
      </header>
      <div id="gallary">
          {
              Object.keys(images).map(k => (
                  <>
                  {images[k].map(imageId => (
                      <div className="photo" key={imageId}>
                          <img
                              src={`https://picsum.photos/id/${imageId}/160/240?blur`}
                              alt="pic"
                          />
                      </div>
                  ))}
                  </>
              ))
          }
      </div>
      {
          isLoading && <p>Loading...</p>
      }
    </div>
  );
}

export default App;
