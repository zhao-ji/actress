import React from 'react';
import {
    useState,
} from 'react';


export function Photo({ image }) {
    const [dimension, updateDimension] = useState(5);
    function onLoad({ target:img }) {
        if (!img.complete) return;
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        updateDimension(Math.ceil(10 * height / (3 * width)));
    }
    return (
        <div className="photo" style={{
            gridRow: `span ${dimension}`
        }}>
            <img 
                src={`https://actress-image.s3-ap-southeast-2.amazonaws.com/${image.Key}`}
                alt="pic"
                style={{
                    width: "10rem",
                }}
                onLoad={onLoad}
            />
        </div>
    );
}
