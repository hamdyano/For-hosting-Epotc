import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTopic, deleteTopic, fetchMyTopics, updateTopic } from "@/api-client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";

interface TopicItem {
  id: number; // Changed from _id
  title: { en: string; ar: string; fr: string };
  paragraph: { en: string; ar: string; fr: string };
  image: string | null;
  youtubeLink: string | null;
  email: string;
  createdAt: string;
  topicId:number;

}

const AddingHome = () => {
  const { t, i18n } = useTranslation();
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTopic, setEditingTopic] = useState<TopicItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const response = await fetchMyTopics();
      setTopics(response.topics);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("error.fetchTopics"));
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeId = (url: string | null) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/
    );
    return match && match[1].length === 11 ? match[1] : null;
  };

  const handleCreate = async (formData: FormData) => {
    try {
      await createTopic(formData);
      await loadTopics();
      setIsCreateDialogOpen(false);
      toast.success(t("success.topicCreated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("error.createTopic"));
    }
  };

  const handleDelete = async (topicId: number) => {
    if (window.confirm(t("confirm.deleteTopic"))) {
      try {
        await deleteTopic(topicId);
        setTopics(topics.filter((item) => item.id !== parseInt(topicId)));
        toast.success(t("success.topicDeleted"));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("error.deleteTopic"));
      }
    }
  };

  const handleUpdate = async (topicId: number, formData: FormData) => {
    try {
      await updateTopic(topicId, formData);
      await loadTopics();
      setIsEditDialogOpen(false);
      toast.success(t("success.topicUpdated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("error.updateTopic"));
    }
  };

  const CreateTopicDialog = () => {
    const [titles, setTitles] = useState({ en: "", ar: "", fr: "" });
    const [paragraphs, setParagraphs] = useState({ en: "", ar: "", fr: "" });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
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

      if (!titles.en || !paragraphs.en) {
        setFormError(t("error.requiredFields"));
        return;
      }

      if (selectedImage && youtubeLink) {
        setFormError(t("error.mediaConflict"));
        return;
      }

      if (!selectedImage && !youtubeLink) {
        setFormError(t("error.mediaRequired"));
        return;
      }

      if (youtubeLink && !isValidYouTubeUrl(youtubeLink)) {
        setFormError(t("error.invalidYoutubeUrl"));
        return;
      }

      const formData = new FormData();
      formData.append("title", JSON.stringify(titles));
      formData.append("paragraph", JSON.stringify(paragraphs));
      if (selectedImage) formData.append("image", selectedImage);
      if (youtubeLink) formData.append("youtubeLink", youtubeLink);

      await handleCreate(formData);
    };

    return (
      <DialogContent>
        <DialogTitle>{t("createTopic")}</DialogTitle>
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
              onChange={(e) =>
                setTitles({ ...titles, [activeLang]: e.target.value })
              }
              placeholder={t("title")}
              className="w-full"
            />
          </div>
          <div>
            <textarea
              value={paragraphs[activeLang as keyof typeof paragraphs]}
              onChange={(e) =>
                setParagraphs({ ...paragraphs, [activeLang]: e.target.value })
              }
              placeholder={t("content")}
              className="w-full min-h-[100px] p-2 border rounded-md"
              rows={4}
            />
          </div>
          <div>
            <Input
              type="url"
              value={youtubeLink}
              onChange={(e) => {
                setYoutubeLink(e.target.value);
                if (e.target.value) setSelectedImage(null);
              }}
              placeholder={t("youtubeLinkPlaceholder")}
              className="w-full mb-2"
            />
            <p className="text-sm text-gray-500 text-center">OR</p>
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setSelectedImage(e.target.files?.[0] || null);
                if (e.target.files?.[0]) setYoutubeLink("");
              }}
              className="w-full mt-2"
              disabled={!!youtubeLink}
            />
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          <Button type="submit" className="w-full">
            {t("createTopic")}
          </Button>
        </form>
      </DialogContent>
    );
  };

  const EditDialog = ({ topicItem }: { topicItem: TopicItem }) => {
    const [titles, setTitles] = useState(topicItem.title);
    const [paragraphs, setParagraphs] = useState(topicItem.paragraph);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [youtubeLink, setYoutubeLink] = useState(topicItem.youtubeLink || "");
    const [activeLang, setActiveLang] = useState(i18n.language);
    const [formError, setFormError] = useState<string | null>(null);

    const isValidYouTubeUrl = (url: string) => {
      const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      return pattern.test(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);

      if (!titles.en || !paragraphs.en) {
        setFormError(t("error.requiredFields"));
        return;
      }

      if (selectedImage && youtubeLink) {
        setFormError(t("error.mediaConflict"));
        return;
      }

      if (!selectedImage && !youtubeLink && !topicItem.image) {
        setFormError(t("error.mediaRequired"));
        return;
      }

      if (youtubeLink && !isValidYouTubeUrl(youtubeLink)) {
        setFormError(t("error.invalidYoutubeUrl"));
        return;
      }

      const formData = new FormData();
      formData.append("title", JSON.stringify(titles));
      formData.append("paragraph", JSON.stringify(paragraphs));

      if (selectedImage) formData.append("image", selectedImage);
      if (youtubeLink) formData.append("youtubeLink", youtubeLink);

      await handleUpdate(topicItem.id.toString(), formData);
    };

    return (
      <DialogContent>
        <DialogTitle>{t("editTopic")}</DialogTitle>
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
              onChange={(e) =>
                setTitles({ ...titles, [activeLang]: e.target.value })
              }
              placeholder={t("title")}
              className="w-full"
            />
          </div>
          <div>
            <textarea
              value={paragraphs[activeLang as keyof typeof paragraphs]}
              onChange={(e) =>
                setParagraphs({ ...paragraphs, [activeLang]: e.target.value })
              }
              placeholder={t("content")}
              className="w-full min-h-[100px] p-2 border rounded-md"
              rows={4}
            />
          </div>
          <div>
            <Input
              type="url"
              value={youtubeLink}
              onChange={(e) => {
                setYoutubeLink(e.target.value);
                if (e.target.value) setSelectedImage(null);
              }}
              placeholder={t("youtubeLinkPlaceholder")}
              className="w-full mb-2"
            />
            <p className="text-sm text-gray-500 text-center">OR</p>
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setSelectedImage(e.target.files?.[0] || null);
                if (e.target.files?.[0]) setYoutubeLink("");
              }}
              className="w-full mt-2"
              disabled={!!youtubeLink}
            />
            {topicItem.image && !youtubeLink && !selectedImage && (
              <p className="text-sm text-gray-500 mt-2">
                {t("currentImageWarning")}
              </p>
            )}
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
        <h1 className="text-3xl font-bold">{t("My Topics")}</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("createTopic")}
            </Button>
          </DialogTrigger>
          <CreateTopicDialog />
        </Dialog>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">
            {t("noTopics")}
          </h2>
          <p className="text-gray-500 mt-2">{t("startCreatingTopic")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((item) => {
            const youtubeId = getYouTubeId(item.youtubeLink);

            return (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={
                        item.title[i18n.language as keyof typeof item.title]
                      }
                    />
                  ) : (
                    <img
                      src={`data:image/jpeg;base64,${item.image}`}
                      alt={item.title[i18n.language as keyof typeof item.title]}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <CardHeader>
                  <h2 className="text-xl font-semibold line-clamp-2">
                    {item.title[i18n.language as keyof typeof item.title]}
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">
                    {
                      item.paragraph[
                        i18n.language as keyof typeof item.paragraph
                      ]
                    }
                  </p>
                </CardContent>
                <CardFooter className="gap-2 justify-end">
                  <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTopic(item)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        {t("Edit")}
                      </Button>
                    </DialogTrigger>
                    {editingTopic && editingTopic.id === item.id && (
                      <EditDialog topicItem={editingTopic} />
                    )}
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("Delete")}
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

export default AddingHome;