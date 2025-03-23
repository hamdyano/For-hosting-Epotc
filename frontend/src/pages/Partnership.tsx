import { useEffect, useState } from "react";
import { fetchPartnerships } from "@/api-client";
import { useTranslation } from "react-i18next";

interface PartnershipItem {
  _id: string;
  websiteUrl: string;
  image: string;
}

const Partnerships = () => {
  const { t } = useTranslation();
  const [partnerships, setPartnerships] = useState<PartnershipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPartnerships = async () => {
      try {
        setLoading(true);
        const partnersData = await fetchPartnerships();
        setPartnerships(partnersData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch partnerships"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPartnerships();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-gray-600">Loading partnerships...</p>
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
          {t("Our Partners")}
        </h1>
        <div className="flex justify-center">
          <div className="w-20 border-b-2 border-[#cf6439] my-2"></div>
        </div>
        <span className="text-white text-xl font-['Roboto']">
          {t("Explore our latest partnerships")}
        </span>
      </div>

      {partnerships.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No partnerships found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerships.map((partner) => (
            <div
              key={partner._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-40 flex items-center justify-center bg-gray-50">
                <img
                  src={`data:image/png;base64,${partner.image}`}
                  alt="Partner logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4 text-center">
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium break-words"
                >
                  Visit Website
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Partnerships;












