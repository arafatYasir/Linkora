import Skeleton from '@mui/material/Skeleton';

const ProfilePhotosSkeleton = () => {
    const boxes = Array(6).fill(0);

    return (
        <div className="grid grid-cols-3 gap-3 mt-2">
            {boxes.map((_, i) => (
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
    );
};

export default ProfilePhotosSkeleton;
