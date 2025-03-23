import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchVideos } from "@/api-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoItem {
  _id: string;
  title: { en: string; ar: string; fr: string };
  youtubeLink: string;
}

const Videos = () => {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return match && match[1].length === 11 ? match[1] : null;
  };

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const response = await fetchVideos();
        setVideos(response.videos);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error.fetchVideos"));
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
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

 {/* Header Section */}
      <div className="bg-[#133355] rounded-2xl shadow-md py-12 flex flex-col gap-5 text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white font-['Roboto']">
          {t('Our Videos')}
        </h1>
        <div className="flex justify-center">
          <div className="w-20 border-b-2 border-[#cf6439] my-2"></div>
        </div>
        <span className="text-white text-xl font-['Roboto']">
          {t('Explore our latest videos about peacekeeping operations and training')}
        </span>
      </div>



      {videos.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">{t("noVideos")}</h2>
          <p className="text-gray-500 mt-2">{t("checkBack")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {videos.map((item) => {
            const youtubeId = getYouTubeId(item.youtubeLink);
            const localizedTitle = getLocalizedContent(item.title);

            return (
              <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {youtubeId && (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      className="w-full h-full scale-105" // Slightly larger iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={localizedTitle}
                    />
                  )}
                </div>
                <CardHeader>
                  <h2 className="text-2xl font-semibold font-['Roboto'] text-[#234d7e] line-clamp-2">
                    {localizedTitle}
                  </h2>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <Button
                    variant="link"
                    className="text-[#cf6439] font-bold hover:underline p-0"
                    onClick={() => navigate(`/video-details/${item._id}`)}
                  >
             
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

export default Videos;
















/* with words import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { useTranslation } from 'react-i18next';

const Videos: React.FC = () => {
  const { t } = useTranslation();

  const videoUrls = [
    {
      url: 'https://www.youtube.com/watch?v=8omVRYH1TJk&t=23s',
      title: t('A promotional video for the Egyptian Center for Training in Peacekeeping Operations and its logistical and training capabilities'),
    },
    {
      url: 'https://www.youtube.com/watch?v=PPkIurye2OY&t=131s',
      title: t('The role of women as police officers or civilians in peacekeeping missions and conflict areas. Band video'),
    },
    {
      url: 'https://www.youtube.com/watch?v=sKja4yfNtNo',
      title: t('A workshop for police unit commanders to develop the performance of formed police units in United Nations peace operations'),
    },
    {
      url: 'https://www.youtube.com/watch?v=36S9ZHTAOKc',
      title: t('Trainer Preparation Team “Pre-deployment Police Training for Peace Support Operations for the African Standby Force.” Band video'),
    },
    {
      url: 'https://www.youtube.com/watch?v=0-aQuFxWrYY&t=129s',
      title: t('A training course entitled “Preparation to join peacekeeping operations for observers - pre-deployment” for security cadres from Commonwealth countries'),
    },
    {
      url: 'https://www.youtube.com/watch?v=K13Jk-RVIHU&t=1s',
      title: t('“International humanitarian law and the role of the International Committee of the Red Cross in conflict areas” group'),
    },
    {
      url: 'https://www.youtube.com/watch?v=8e5VC66SoeA&t=8s',
      title: t('The fifteenth workshop on developing training programs for the military, police and civilian components of the African Ready Force'),
    },
  ];

  return (
    <div className="flex flex-col gap-12 p-6">
      {/* Header Section *//*
      <div className="bg-[#133355] rounded-2xl shadow-md py-12 flex flex-col gap-5 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white font-['Roboto']">
          {t('Our Videos')}
        </h1>
        <div className="flex justify-center">
          <div className="w-20 border-b-2 border-[#cf6439] my-2"></div>
        </div>
        <span className="text-white text-xl font-['Roboto']">
          {t('Explore our latest videos about peacekeeping operations and training')}
        </span>
      </div>

      {/* Video List *//*
      <div className="flex flex-col gap-8">
        {videoUrls.map((video, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-md hover:scale-105 transition-all duration-300 ease-in-out flex flex-col ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } items-center`}
          >
            {/* Video *//*
            <div className="w-full md:w-1/2 p-4">
              <VideoPlayer url={video.url} />
            </div>

            {/* Content *//*
            <div className="w-full md:w-1/2 p-6 text-center md:text-left">
              <h2 className="text-[#264e7c]  text-2xl tracking-tighter font-['Roboto'] mb-4">
                {video.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos; */





