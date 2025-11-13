const PhotosGroup = ({ groupName, images }) => {
    return (
        <div>
            <h4>{groupName}</h4>
            <div className="grid grid-cols-[120px_120px_120px_120px_120px] justify-between gap-x-1 gap-y-2.5 mt-2">
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
                                onClick={() => {}}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default PhotosGroup