import React, {useState} from "react";

interface PictureChoiceTaskProps {
    image: string | null;
    clickPosition: ClickPosition | null;
    onDataChange: (image: string | null, clickPosition: ClickPosition | null) => void;
}

const PictureChoiceTask = ({image, clickPosition, onDataChange}) => {

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onDataChange(reader.result as string, clickPosition)
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
        if (!image) return;

        const {offsetX, offsetY} = event.nativeEvent;

        onDataChange(image, {x: offsetX, y: offsetY})
    };

    return (
        <div className="flex flex-col items-center">
            <label
                className="cursor-pointer mt-4 font-poppins bg-teal-500 text-white px-6 py-3 rounded-md font-bold select-none hover:bg-teal-600 transition duration-300">
                Upload Media
                <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </label>
            {image && (
                <div className="relative">
                    <img
                        src={image}
                        alt="Task"
                        onClick={handleImageClick}
                        className="w-full mt-4 h-fit max-h-64 rounded-md"
                    />
                    {clickPosition && (
                        <div
                            className="absolute w-4 h-4 bg-red-500 rounded-full"
                            style={{left: clickPosition.x, top: clickPosition.y, transform: "translate(-25%, 25%)"}}
                        ></div>
                    )}
                </div>
            )}
            {clickPosition && (
                <p className="mt-4 text-black font-poppins">
                    Clicked at: X: {clickPosition.x}, Y: {clickPosition.y}
                </p>
            )}
        </div>
    );
}

export default PictureChoiceTask;