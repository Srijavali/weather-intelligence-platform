import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Records from "../pages/Records";
import CreateRecord from "../pages/CreateRecord";
import EditRecord from "../pages/EditRecord";
import RecordDetails from "../pages/RecordDetails";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/records" element={<Records />} />

      <Route
        path="/records/new"
        element={<CreateRecord />}
      />

      <Route
        path="/records/:id"
        element={<RecordDetails />}
      />

      <Route
        path="/records/:id/edit"
        element={<EditRecord />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;