import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/*
        Keep global banners here later:

        <OfflineBanner />
        <StaleDataBanner />

        Putting them here ensures every route
        receives the same user experience.
      */}

      <main>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;