import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createVideo, deleteVideo, fetchMyVideos, updateVideo, VideoItem } from "@/api-client";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";


interface VideoItem {
  id: number; // Changed from _id
  title: { en: string; ar: string; fr: string };
  youtubeLink: string | null;
  email: string;
  createdAt: string;
  videoId:number;

}



const AddingVideos = () => {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await fetchMyVideos();
      setVideos(response.videos);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("error.fetchVideos"));
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return match && match[1].length === 11 ? match[1] : null;
  };

  const handleCreate = async (videoData: { title: { en: string; ar: string; fr: string }; youtubeLink: string }) => {
    try {
      await createVideo(videoData);
      await loadVideos();
      setIsCreateDialogOpen(false);
      toast.success(t("success.videoCreated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("error.createVideo"));
    }
  };

  const handleDelete = async (videoId: number) => {
    if (window.confirm(t("confirm.deleteVideo"))) {
      try {
        await deleteVideo(videoId);
        setVideos(videos.filter((item) => item.id !== videoId));
        toast.success(t("success.videoDeleted"));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("error.deleteVideo"));
      }
    }
  };

  const handleUpdate = async (videoId: number, videoData: { title?: { en: string; ar: string; fr: string }; youtubeLink?: string }) => {
    try {
      await updateVideo(videoId, videoData);
      await loadVideos();
      setIsEditDialogOpen(false);
      toast.success(t("success.videoUpdated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("error.updateVideo"));
    }
  };

  const CreateVideoDialog = () => {
    const [titles, setTitles] = useState({ en: "", ar: "", fr: "" });
    const [youtubeLink, setYoutubeLink] = useState("");
    const [activeLang, setActiveLang] = useState(i18n.language);
    const [formError, setFormError] = useState<string | null>(null);

    const isValidYouTubeUrl = (url: string) => {
      const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      return pattern.test(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);

      if (!titles.en || !titles.ar || !titles.fr) {
        setFormError(t("error.allTitlesRequired"));
        return;
      }

      if (!youtubeLink) {
        setFormError(t("error.youtubeLinkRequired"));
        return;
      }

      if (!isValidYouTubeUrl(youtubeLink)) {
        setFormError(t("error.invalidYoutubeUrl"));
        return;
      }

      await handleCreate({ title: titles, youtubeLink });
    };

    return (
      <DialogContent>
        <DialogTitle>{t("addVideo")}</DialogTitle>
        <div className="flex gap-2 mb-4">
          {["en", "ar", "fr"].map((lang) => (
            <Button
              key={lang}
              variant={activeLang === lang ? "default" : "outline"}
              onClick={() => setActiveLang(lang)}
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={titles[activeLang as keyof typeof titles]}
              onChange={(e) => setTitles({ ...titles, [activeLang]: e.target.value })}
              placeholder={t("videoTitle")}
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full"
            />
          </div>
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          <Button type="submit" className="w-full">
            {t("addVideo")}
          </Button>
        </form>
      </DialogContent>
    );
  };

  const EditDialog = ({ videoItem }: { videoItem: VideoItem }) => {
    const [titles, setTitles] = useState(videoItem.title);
    const [youtubeLink, setYoutubeLink] = useState(videoItem.youtubeLink);
    const [activeLang, setActiveLang] = useState(i18n.language);
    const [formError, setFormError] = useState<string | null>(null);

    const isValidYouTubeUrl = (url: string) => {
      const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      return pattern.test(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);

      if (!titles.en || !titles.ar || !titles.fr) {
        setFormError(t("error.allTitlesRequired"));
        return;
      }

      if (!youtubeLink) {
        setFormError(t("error.youtubeLinkRequired"));
        return;
      }

      if (!isValidYouTubeUrl(youtubeLink)) {
        setFormError(t("error.invalidYoutubeUrl"));
        return;
      }

      await handleUpdate(videoItem.id, { title: titles, youtubeLink });
    };

    return (
      <DialogContent>
        <DialogTitle>{t("editVideo")}</DialogTitle>
        <div className="flex gap-2 mb-4">
          {["en", "ar", "fr"].map((lang) => (
            <Button
              key={lang}
              variant={activeLang === lang ? "default" : "outline"}
              onClick={() => setActiveLang(lang)}
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={titles[activeLang as keyof typeof titles]}
              onChange={(e) => setTitles({ ...titles, [activeLang]: e.target.value })}
              placeholder={t("videoTitle")}
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full"
            />
          </div>
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          <Button type="submit" className="w-full">
            {t("saveChanges")}
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
        <h1 className="text-3xl font-bold">{t("My Videos")}</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("addVideo")}
            </Button>
          </DialogTrigger>
          <CreateVideoDialog />
        </Dialog>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">
            {t("noVideos")}
          </h2>
          <p className="text-gray-500 mt-2">{t("startAddingVideos")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((item) => {
            const youtubeId = getYouTubeId(item.youtubeLink);
            
            return (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {youtubeId && (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={item.title[i18n.language as keyof typeof item.title]}
                    />
                  )}
                </div>
                <CardHeader>
                  <h2 className="text-xl font-semibold line-clamp-2">
                    {item.title[i18n.language as keyof typeof item.title]}
                  </h2>
                </CardHeader>
                <CardFooter className="gap-2 justify-end">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingVideo(item)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        {t("edit")}
                      </Button>
                    </DialogTrigger>
                    {editingVideo && editingVideo.id === item.id && (
                      <EditDialog videoItem={editingVideo} />
                    )}
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("delete")}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddingVideos;