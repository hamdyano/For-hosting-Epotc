import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
import NewsAndEvents from "./pages/NewsAndEvents";
import FactsAndStatistics from "./pages/FactsAndStatistics";
import Partnership from "./pages/Partnership";
import Allphotos from "./pages/Allphotos";
import Videos from "./pages/Videos";
import ContactUs from "./pages/ContactUs";
import MyNews from "./pages/MyNews";
import UserProfilePage from "./pages/UserProfilePage";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./contexts2/AppContext";
import Details from "./pages/details";
import AddingPartner from "./pages/AddingPartner";
import AddingPhotos from "./pages/AddingPhotos";
import AddingVideos from "./pages/AddingVideos";
import AddingHome from "./pages/AddingHome";
const AppRoutes = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout showHero>
            <HomePage />
          </Layout>
        }
      />

      <Route
        path="/NewsAndEvents"
        element={
          <Layout>
            <NewsAndEvents />
          </Layout>
        }
      />

      <Route
        path="/FactsAndStatistics"
        element={
          <Layout>
            <FactsAndStatistics />
          </Layout>
        }
      />

      <Route
        path="/partnership"
        element={
          <Layout>
            <Partnership />
          </Layout>
        }
      />

      <Route
        path="/Allphotos"
        element={
          <Layout>
            <Allphotos />
          </Layout>
        }
      />

      <Route
        path="/Videos"
        element={
          <Layout>
            <Videos />
          </Layout>
        }
      />

      <Route
        path="/ContactUs"
        element={
          <Layout>
            <ContactUs />
          </Layout>
        }
      />

      <Route
        path="/signin"
        element={
          <Layout>
            <SignIn />
          </Layout>
        }
      />

      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />

      {/* Protected Route */}
      {isLoggedIn ? (
        <Route
          path="/user-profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        />
      ) : (
        <Route path="/user-profile" element={<Navigate to="/" replace />} />
      )}

      {/* Protected Route */}
      {isLoggedIn ? (
        <Route
          path="/MyNews"
          element={
            <Layout>
              <MyNews />
            </Layout>
          }
        />
      ) : (
        <Route path="/MyNews" element={<Navigate to="/" replace />} />
      )}

      {/* Details Page */}
      <Route
        path="/details/:id"
        element={
          <Layout>
            <Details />
          </Layout>
        }
      />

      {/* Protected Route */}
      {isLoggedIn ? (
        <Route
          path="/AddingPartner"
          element={
            <Layout>
              <AddingPartner />
            </Layout>
          }
        />
      ) : (
        <Route path="/" element={<Navigate to="/" replace />} />
      )}

      {/* Protected Route */}
      {isLoggedIn ? (
        <Route
          path="/AddingPhotos"
          element={
            <Layout>
              <AddingPhotos />
            </Layout>
          }
        />
      ) : (
        <Route path="/" element={<Navigate to="/" replace />} />
      )}

       {/* Protected Route */}
       {isLoggedIn ? (
        <Route
          path="/AddingVideos"
          element={
            <Layout>
              <AddingVideos />
            </Layout>
          }
        />
      ) : (
        <Route path="/" element={<Navigate to="/" replace />} />
      )}


  {/* Protected Route */}
  {isLoggedIn ? (
        <Route
          path="/AddingHome"
          element={
            <Layout>
              <AddingHome />
            </Layout>
          }
        />
      ) : (
        <Route path="/" element={<Navigate to="/" replace />} />
      )}









      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
