import React from 'react';
import {
    useState,
} from 'react';

import Modal from 'react-modal';
import { useSwipeable } from 'react-swipeable';


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
                src={`https://actress-image.s3-ap-southeast-2.amazonaws.com/${image.Key}`}
                alt="pic"
                onLoad={onLoad}
                style={{
                    width: "10rem",
                }}
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
    transform             : 'translate(-50%, -50%)',
    padding               : 0,
  }
};

export function ImgModal({
    image,
    closeModal,
    clickPrevious,
    clickDelete,
    clickAfter,
}) {
    const handlers = useSwipeable({
        onSwipedLeft: clickAfter,
        onSwipedRight: clickPrevious,
        onSwipedUp: clickDelete,
    });
    const windowWidth = "innerHeight" in window ? window.innerWidth: document.documentElement.offsetWidth;
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;

    if (!image) return false;
    Modal.setAppElement('#root');

    return (
        <Modal
            isOpen={image && true}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Photo Popup"
        >
            <img
                src={`https://actress-image.s3-ap-southeast-2.amazonaws.com/${image.Key}`}
                alt="pic"
                onClick={closeModal}
                style={{
                    height: 'auto',
                    width: 'auto',
                    margin: '1 auto',
                    maxWidth: windowWidth,
                    maxHeight: windowHeight - 30,
                }}
                {...handlers}
            />
            <div className="btn-group">
                <button onClick={clickPrevious}>
                    Previous
                </button>
                <button onClick={clickDelete}>
                    Delete
                </button>
                <button onClick={clickAfter}>
                    After
                </button>
            </div>
        </Modal>
    );
}
