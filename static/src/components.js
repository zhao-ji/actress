import React from 'react';
import {
    useState,
} from 'react';

import Modal from 'react-modal';


export function Photo({ image, setImage }) {
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
                style={{
                    width: "10rem",
                }}
                src={`https://actress-image.s3-ap-southeast-2.amazonaws.com/${image.Key}`}
                alt="pic"
                onLoad={onLoad}
                onClick={() => setImage(image)}
            />
        </div>
    );
}


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export function ImgModal({ image, setImage }) {
    function closeModal() {
        setImage(null);
    }
    if (!image) return false;
    return (
        <Modal
            isOpen={image && true}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <img
                src={`https://actress-image.s3-ap-southeast-2.amazonaws.com/${image.Key}`}
                alt="pic"
                onClick={closeModal}
            />
            <div>
                <button>
                    Previous
                </button>
                <button>
                    Delete
                </button>
                <button>
                    After
                </button>
            </div>
        </Modal>
    );
}
