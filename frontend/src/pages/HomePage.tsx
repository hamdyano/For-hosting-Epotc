import React, { useState, ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchFeaturedNews, fetchTopics } from "@/api-client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import i18n from "@/i18n";



interface SeeMoreTextProps {
  children: string | ReactNode;
  maxLength?: number;
}

export interface NewsItem {
  id: number;
  title: { en: string; ar: string; fr: string };
  paragraph: { en: string; ar: string; fr: string };
  image: string | null;
  youtubeLink: string | null;
  isFeatured?: boolean;
  email: string;
  createdAt: string;
}

export interface TopicItem {
  id: number;
  title: { en: string; ar: string; fr: string };
  paragraph: { en: string; ar: string; fr: string };
  image: string | null;
  youtubeLink: string | null;
  email: string;
  createdAt: string;
}

const SeeMoreText: React.FC<SeeMoreTextProps> = ({
  children,
  maxLength = 300,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textContent = typeof children === "string" ? children : "";

  if (textContent.length <= maxLength) {
    return <p className="text-[#264e7c] text-1xl tracking-tighter font-['Roboto']">{children}</p>;
  }

  return (
    <div>
      <p className="text-[#264e7c] text-1xl tracking-tighter font-['Roboto']">
        {isExpanded ? children : `${textContent.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[#cf6439] font-bold mt-2 hover-underline"
      >
        {isExpanded ? "See Less" : "See More"}
      </button>
    </div>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getYouTubeId = (url: string | null) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/
    );
    return match && match[1].length === 11 ? match[1] : null;
  };

  const getLocalizedContent = (content: {
    en: string;
    ar: string;
    fr: string;
  }) => {
    const lang = i18n.language as keyof typeof content;
    return content[lang] || content.en;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [newsResponse, topicsResponse] = await Promise.all([
          fetchFeaturedNews(),
          fetchTopics()
        ]);
        setFeaturedNews(newsResponse.news);
        setTopics(topicsResponse.topics);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const renderMedia = (item: NewsItem | TopicItem) => {
    const youtubeId = getYouTubeId(item.youtubeLink);
    
    return youtubeId ? (
      <div className="w-full aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          className="w-full h-full rounded-lg"
          allowFullScreen
          title={getLocalizedContent(item.title)}
        />
      </div>
    ) : (
      item.image && (
        <img
          src={`data:image/jpeg;base64,${item.image}`}
          alt={getLocalizedContent(item.title)}
          className="w-full h-full object-cover rounded-lg aspect-video"
          loading="lazy"
        />
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cf6439]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 container mx-auto px-4">
      {/* Hero Section */}
      <div className="bg-[#133355] rounded-2xl shadow-md py-12 text-center mt-[-6rem]">
        <h1 className="text-4xl font-bold text-white font-['Roboto'] mb-4">
          {t("homepage.title")}
        </h1>
        <p className="text-white text-xl font-['Roboto']">
          {t("homepage.subtitle")}
        </p>
      </div>







      {/*Featured News*/}

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-[#264e7c] mb-8 text-center font-['Roboto']">
          {t("Latest News")}
        </h2>

        <div className="flex justify-center">
          <div className="w-20 border-b-2 border-[#cf6439] my-2 mb-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {featuredNews.map((item) => {
            const youtubeId = getYouTubeId(item.youtubeLink);
            const localizedTitle = getLocalizedContent(item.title);
            const localizedParagraph = getLocalizedContent(item.paragraph);

            return (
              //news added by admin

              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative "
              >
                {/* Media Section */}
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      className="w-full h-full"
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

                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-[#264e7c] line-clamp-2 mb-2 font-['Roboto']">
                    {localizedTitle}
                  </h3>
                  <p className="text-[#264e7c] text-sm line-clamp-3 mb-4 font-['Roboto']">
                    {localizedParagraph}
                  </p>
                  <Button
                    variant="link"
                    className="text-[#cf6439] font-bold p-0 hover:underline"
                    onClick={() => navigate(`/details/${item.id}`)}
                  >
                    {t("Read More")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =============================================
      //             Main sections (Topics)
      // ============================================= */}
      <div className="space-y-16">
        {topics.map((topic, index) => {
          const isEven = index % 2 === 0;
          const localizedTitle = getLocalizedContent(topic.title);
          const localizedContent = getLocalizedContent(topic.paragraph);

          return (
            <div 
              key={topic.id}
              className={`flex flex-col gap-8 md:gap-12 ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Media Column */}
              <div className="w-full md:w-1/2 shadow-xl rounded-xl overflow-hidden">
                {renderMedia(topic)}
              </div>

              {/* Content Column */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-[#264e7c] mb-4">
                  {localizedTitle}
                </h2>
                <div className="w-24 h-1 bg-[#cf6439] mb-6"></div>
                <SeeMoreText maxLength={400}>
                  {localizedContent}
                </SeeMoreText>
            
              </div>
            </div>
          );
        })}

        {/* Original Static Sections */}

        
      </div>
    </div>
  );
};

export default HomePage;

