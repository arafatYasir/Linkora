import Skeleton from "@mui/material/Skeleton"

const ChoosePhotosSkeleton = () => {
    return (
        <div className="grid grid-cols-[120px_120px_120px_120px_120px] gap-4 mt-2">
            {[...Array(4)].map((_, i) => (
                <Skeleton
                    key={i}
                    variant="rectangular"
                    width={120}
                    height={120}
                    animation="wave"
                    sx={{
                        bgcolor: 'grey.900',
                    }}
                />
            ))}
        </div>
    )
}

export default ChoosePhotosSkeleton