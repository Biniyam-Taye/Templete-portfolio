import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

const HeroImageUploader = ({ pageKey, currentImage, onImageChange }) => {
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                // Save to localStorage
                const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
                heroImages[pageKey] = imageData;
                localStorage.setItem('hero_images', JSON.stringify(heroImages));

                if (onImageChange) {
                    onImageChange(imageData);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        delete heroImages[pageKey];
        localStorage.setItem('hero_images', JSON.stringify(heroImages));

        if (onImageChange) {
            onImageChange(null);
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            display: 'flex',
            gap: '8px',
            zIndex: 20
        }}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                accept="image/*"
            />

            <button
                onClick={() => fileInputRef.current.click()}
                style={{
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: '#fff',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 500
                }}
                title="Upload Hero Image"
            >
                <Upload size={14} />
                {currentImage ? 'Change' : 'Upload'} Hero
            </button>

            {currentImage && (
                <button
                    onClick={handleRemoveImage}
                    style={{
                        background: 'rgba(239,68,68,0.8)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#fff',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    title="Remove Hero Image"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};

export default HeroImageUploader;
