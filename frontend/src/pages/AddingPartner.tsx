import React, { useEffect, useState } from 'react';
import { Card, CardContent, /*CardHeader*/ CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createPartner, deletePartner, fetchMyPartners, updatePartner } from '@/api-client';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PartnershipItem {
  id: number;
  websiteUrl: string;
  image: string;
  email: string;
}

const AddingPartner = () => {
  const [partnerships, setPartnerships] = useState<PartnershipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<PartnershipItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const response = await fetchMyPartners();
      setPartnerships(response);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (websiteUrl: string, image: File) => {
    try {
      const formData = new FormData();
      formData.append('websiteUrl', websiteUrl);
      formData.append('image', image);

      await createPartner(formData);
      await loadPartners();
      setIsCreateDialogOpen(false);
      toast.success('Partner added successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create partner');
    }
  };

  const handleDelete = async (partnerId: number) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner(partnerId);
        setPartnerships(partnerships.filter(item => item.id !== partnerId));
        toast.success('Partner deleted successfully!');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete partner');
      }
    }
  };

  const handleUpdate = async (partnerId: string, formData: FormData) => {
    try {
      await updatePartner(partnerId, formData);
      await loadPartners();
      setIsEditDialogOpen(false);
      toast.success('Partner updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update partner');
    }
  };

  const CreatePartnerDialog = () => {
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);

      if (!websiteUrl || !selectedImage) {
        setFormError('Please provide both website URL and image');
        return;
      }

      await handleCreate(websiteUrl, selectedImage);
    };

    return (
      <DialogContent>
        <DialogTitle>Add New Partner</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="Website URL (https://example.com)"
              className="w-full"
            />
          </div>
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
            Add Partner
          </Button>
        </form>
      </DialogContent>
    );
  };

  const EditDialog = ({ partner }: { partner: PartnershipItem }) => {
    const [websiteUrl, setWebsiteUrl] = useState(partner.websiteUrl);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('websiteUrl', websiteUrl);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await handleUpdate(partner.id, formData);
    };

    return (
      <DialogContent>
        <DialogTitle>Edit Partner</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="Website URL"
              className="w-full"
            />
          </div>
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
        <h1 className="text-3xl font-bold">My Partners</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <CreatePartnerDialog />
        </Dialog>
      </div>

      {partnerships.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">No partners found</h2>
          <p className="text-gray-500 mt-2">Start adding your first partner!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerships.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={`data:image/png;base64,${item.image}`}
                  alt="Partner logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-words block mt-4 text-center"
                >
                  Visit Website
                </a>
              </CardContent>
              <CardFooter className="gap-2 justify-end">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingPartner(item)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  {editingPartner && editingPartner.id === item.id && (
                    <EditDialog partner={editingPartner} />
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

export default AddingPartner;