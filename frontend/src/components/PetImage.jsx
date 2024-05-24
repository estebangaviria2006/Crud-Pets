// src/components/PetImage.js

import React from 'react';
import bgPetCamera from '../assets/photo-lg-1.svg';

const PetImage = ({ photo }) => {
    return photo ? (
        <img
            src={`http://localhost:3000/img/${photo}`}
            alt="Mascota"
            className="object-cover w-32 h-32 -mt-8 rounded-full cursor-pointer"
        />
    ) : (
        <img src={bgPetCamera} alt="Camera" className="-mt-8 cursor-pointer" />
    );
};

export default PetImage;
