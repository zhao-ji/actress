import React from 'react';
import {
    useState,
} from 'react';

import Image from "react-image-enlarger";


export function Photo({ image }) {
    const [dimension, updateDimension] = useState(5);
    const [zoomed, setZoomed] = React.useState(false);
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
            <Image
                style={{
                    width: "10rem",
                }}
                src={`https://actress-image.s3-ap-southeast-2.amazonaws.com/${image.Key}`}
                enlargedSrc={`https://actress-image.s3-ap-southeast-2.amazonaws.com/${image.Key}`}
                alt="pic"
                onLoad={onLoad}
                zoomed={zoomed}
                onClick={() => setZoomed(true)}
                onRequestClose={() => setZoomed(false)}
            />
        </div>
    );
}
