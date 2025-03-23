import React, { useEffect, useState } from 'react';
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createPhoto, deletePhoto, fetchMyPhotos, updatePhoto } from '@/api-client';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PhotoItem {
  id: number;
  image: string;
  email: string;
}

const AddingPhotos = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetchMyPhotos();
      setPhotos(response);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (image: File) => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      await createPhoto(formData);
      await loadPhotos();
      setIsCreateDialogOpen(false);
      toast.success('Photo uploaded successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload photo');
    }
  };

  const handleDelete = async (photoId: number) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await deletePhoto(photoId);
        setPhotos(photos.filter(item => item.id !== photoId));
        toast.success('Photo deleted successfully!');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete photo');
      }
    }
  };

  const handleUpdate = async (photoId: string, formData: FormData) => {
    try {
      await updatePhoto(photoId, formData);
      await loadPhotos();
      setIsEditDialogOpen(false);
      toast.success('Photo updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update photo');
    }
  };

  const CreatePhotoDialog = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);

      if (!selectedImage) {
        setFormError('Please select an image');
        return;
      }

      await handleCreate(selectedImage);
    };

    return (
      <DialogContent>
        <DialogTitle>Upload New Photo</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
          {formError && (
            <p className="text-red-500 text-sm">{formError}</p>
          )}
          <Button type="submit" className="w-full">
            Upload Photo
          </Button>
        </form>
      </DialogContent>
    );
  };

  const EditDialog = ({ photo }: { photo: PhotoItem }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData();
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await handleUpdate(photo.id, formData);
    };

    return (
      <DialogContent>
        <DialogTitle>Edit Photo</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Photos</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </DialogTrigger>
          <CreatePhotoDialog />
        </Dialog>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">No photos found</h2>
          <p className="text-gray-500 mt-2">Start uploading your first photo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={`data:image/png;base64,${item.image}`}
                  alt="Uploaded content"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardFooter className="gap-2 justify-end p-4">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingPhoto(item)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  {editingPhoto && editingPhoto.id === item.id && (
                    <EditDialog photo={editingPhoto} />
                  )}
                </Dialog>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddingPhotos;