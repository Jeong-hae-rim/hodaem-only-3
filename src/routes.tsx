import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from "./pages/App";
// import Secretpage from "./pages/SecretPage";
import NotFound from "./pages/404";
// import GamePage from "./pages/GamePage";
// import RollingPage from "./pages/RollingPage";
import MdPage from "./pages/MdPage";

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<App />} /> */}
          <Route path="/goods" element={<MdPage />} />
          {/* <Route path="/yummychu" element={<RollingPage />} /> */}
          {/* <Route path="/:tab?" element={<Secretpage />} /> */}
          {/* <Route path="/game2048" element={<GamePage />} /> */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
