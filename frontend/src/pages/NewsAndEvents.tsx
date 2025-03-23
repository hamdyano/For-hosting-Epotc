import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchNews } from "@/api-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: number;
  title: { en: string; ar: string; fr: string };
  paragraph: { en: string; ar: string; fr: string };
  image: string | null;
  youtubeLink: string | null;
}

const NewsAndEvents = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getYouTubeId = (url: string | null) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return match && match[1].length === 11 ? match[1] : null;
  };

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const response = await fetchNews();
        setNews(response.news);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error.fetchNews"));
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [t]);

  const getLocalizedContent = (content: { en: string; ar: string; fr: string }) => {
    const lang = i18n.language as keyof typeof content;
    return content[lang] || content.en;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-gray-600">{t("loading")}</p>
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
    <div className="container mx-auto px-4 py-8" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className={`text-3xl font-bold mb-8 text-[#234d7e] font-['Roboto'] ${i18n.language === "ar" ? "text-right" : "text-left"}`}>
        {t("Highlights")}
      </div>

      <div className={`w-24 border-b-2 border-[#cf6439] mb-8 ${i18n.language === "ar" ? "ml-auto" : "mr-auto"}`}></div>

      {news.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">{t("noArticles")}</h2>
          <p className="text-gray-500 mt-2">{t("checkBack")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => {
            const youtubeId = getYouTubeId(item.youtubeLink);
            const localizedTitle = getLocalizedContent(item.title);
            const localizedParagraph = getLocalizedContent(item.paragraph);

            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={localizedTitle}
                    />
                  ) : (
                    item.image && (
                      <img
                        src={`data:image/jpeg;base64,${item.image}`}
                        alt={localizedTitle}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )
                  )}
                </div>
                <CardHeader>
                  <h2 className="text-xl font-semibold font-['Roboto'] text-[#234d7e] line-clamp-2">
                    {localizedTitle}
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 font-['Roboto'] text-[#234d7e]">
                    {localizedParagraph}
                  </p>
                  <Button
                    variant="link"
                    className="mt-2 p-0 text-[#cf6439] font-bold hover:underline"
                    onClick={() => navigate(`/details/${item.id}`)}
                  >
                    {t("Read More")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsAndEvents;















/* before dpimport { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchNews } from "@/api-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsItem {
  _id: string;
  title: {
    en: string;
    ar: string;
    fr: string;
  };
  paragraph: {
    en: string;
    ar: string;
    fr: string;
  };
  image: string;
}

const NewsAndEvents = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const response = await fetchNews();
        setNews(response.news);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error.fetchNews"));
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [t]);

  const getLocalizedContent = (content: {
    en: string;
    ar: string;
    fr: string;
  }) => {
    const lang = i18n.language as keyof typeof content;
    return content[lang] || content.en;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-gray-600">{t("loading")}</p>
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
    <div
      className="container mx-auto px-4 py-8"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div
        className={`text-3xl font-bold mb-8 text-[#234d7e] font-['Roboto'] ${
          i18n.language === "ar" ? "text-right" : "text-left"
        }`}
      >
        {t("Highlights")}
      </div>

      <div
        className={`w-24 border-b-2 border-[#cf6439] mb-8 ${
          i18n.language === "ar" ? "ml-auto" : "mr-auto"
        }`}
      ></div>

      {news.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">
            {t("noArticles")}
          </h2>
          <p className="text-gray-500 mt-2">{t("checkBack")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card
              key={item._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={getLocalizedContent(item.title)}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <h2 className="text-xl font-semibold font-['Roboto'] text-[#234d7e] line-clamp-2">
                  {getLocalizedContent(item.title)}
                </h2>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 font-['Roboto'] text-[#234d7e] ">
                  {getLocalizedContent(item.paragraph)}
                </p>
                <Button
                  variant="link"
                  className="mt-2 p-0 text-[#cf6439] font-bold hover:underline"
                  onClick={() => navigate(`/details/${item._id}`)}
                >
                  {t("Read More")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsAndEvents;*/
