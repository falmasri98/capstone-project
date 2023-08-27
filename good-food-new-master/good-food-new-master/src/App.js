import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/auth-hook";
import "./App.css";

import HomePage from "./pages/Home/HomePage";
import StroesPage from "./pages/StroesPage/StoresPage";
import AuthPage from "./pages/Auth/AuthPage";
import SingleStore from "./pages/StroesPage/SingleStore";
import AboutUs from "./pages/AboutUs/AboutUs";
import ContactUs from "./pages/ContactUs/ContactUs";

// Dashboards for [Admin, Customer, Provider]
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLoginPage from "./pages/Admin/AdminLogin/AdminLoginPage";

import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import ProviderDashboard from "./pages/Provider/ProviderDashboard";

const languages = [
  {
    code: "en",
    name: "English",
    country_code: "gb",
  },
  {
    code: "ar",
    name: "العربية",
    dir: "rtl",
    country_code: "sa",
  },
];

function App() {
  const { token, login, logout, userId, user } = useAuth();
  const currentLanguageCode = localStorage.getItem("lang") || "en";
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode);
  const { t } = useTranslation();

  useEffect(() => {
    document.body.dir = currentLanguage.dir || "ltr";
    document.title = t("app-title");
  }, [currentLanguage, t]);

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/about-us" element={<AboutUs />} exact />
        <Route path="/contact-us" element={<ContactUs />} exact />
        <Route path="/stores" element={<StroesPage />} exact />
        <Route path="/stores/:storeId" element={<SingleStore />} exact />
        <Route path="/auth" element={<AuthPage />} exact />
        <Route path="/admin-auth" element={<AdminLoginPage />} exact />
        <Route
          path="/provider/dashboard/*"
          element={<ProviderDashboard />}
          exact
        />
        <Route path="/user/dashboard/*" element={<CustomerDashboard />} exact />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/about-us" element={<AboutUs />} exact />
        <Route path="/contact-us" element={<ContactUs />} exact />
        <Route path="/auth" element={<AuthPage />} exact />
        <Route path="/admin-auth" element={<AdminLoginPage />} exact />
        <Route path="/stores/:storeId" element={<SingleStore />} exact />

        {/* <Route path="/dashboard" element={<CustomerDashboard />} exact /> */}
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
      </Routes>
    );
  }

  return (
    <div className="App">
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          user: user,
          login: login,
          logout: logout,
        }}
      >
        <Router>{routes}</Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
