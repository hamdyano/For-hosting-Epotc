import { useEffect, useState } from 'react';
import { fetchAllPhotos } from '@/api-client';
import { useTranslation } from 'react-i18next';

interface PhotoItem {
  _id: string;
  image: string;
  createdAt: string;
}

const AllPhotos = () => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true);
        const photosData = await fetchAllPhotos();
        setPhotos(photosData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch photos');
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-gray-600">Loading photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (


    <div className="container mx-auto px-4 py-8">




      
     <div className="bg-[#133355] rounded-2xl shadow-md py-12 flex flex-col gap-5 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white font-['Roboto']">
          {t('Our Photos')}
        </h1>
        <div className="flex justify-center">
          <div className="w-20 border-b-2 border-[#cf6439] my-2"></div>
        </div>
        <span className="text-white text-xl font-['Roboto']">
          {t('Explore our latest photos')}
        </span>
      </div>




      
      {photos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No photos available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div 
              key={photo._id}
              className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={`data:image/png;base64,${photo.image}`}
                alt="User uploaded content"
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-40 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Uploaded {new Date(photo.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPhotos;



