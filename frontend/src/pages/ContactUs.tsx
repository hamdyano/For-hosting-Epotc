const ContactUs = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#133355] rounded-2xl">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Contact Us
      </h1>
      <div className="bg-slate-200 p-8 rounded-2xl shadow-sm">
        {/* Phone Section */}
        <div className="flex items-start mb-6">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg mr-4">
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Phone :</h2>
            <p className="text-gray-600">(+202) 23840151 – 23840152</p>
          </div>
        </div>

      

        {/* Email Section */}
        <div className="flex items-start mb-6">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg mr-4">
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Email :</h2>
            <div className="space-y-1">
              <p className="text-blue-600 hover:underline">epotc@moi.gov.eg</p>
            
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="flex items-start mb-6">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg mr-4">
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Address :</h2>
            <p className="text-gray-600">Police Academy -  first settlement – new Cairo – Egypt </p>
          </div>
        </div>

        {/* Post Number Section */}
        <div className="flex items-start">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg mr-4">
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Post no. :</h2>
            <p className="text-gray-600">11865</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;