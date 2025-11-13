const PhotosGroup = ({ groupName, images, select, setImage, closeModal, setCloseModal, cols = 4 }) => {
    return (
        <div>
            <h4>{groupName}</h4>
            <div 
                className="grid justify-between gap-2.5 mt-2"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 120px)`
                }}
            >
                {
                    images?.map((image, index) => (
                        <div
                            key={index}
                            className="w-full h-[120px] overflow-hidden cursor-pointer transition-all duration-250 border border-border hover:opacity-50"
                        >
                            <img
                                src={image}
                                alt="Select Photo"
                                className="w-full h-full object-cover"
                                onClick={select ? () => {
                                    setImage(image);

                                    if (closeModal) {
                                        setCloseModal(false);
                                    }
                                } : null}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default PhotosGroup