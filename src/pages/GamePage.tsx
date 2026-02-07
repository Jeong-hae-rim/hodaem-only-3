import "./SecretPage.css";
import BASKET from "../assets/images/eye2.png";
import EYE from "../assets/images/eye1.png";
import EYE2 from "../assets/images/eye3.png";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SESSION_KEY } from "../func/constants";
import Sidebar from "../components/Sidebar";
import type { MenuItem, MenuKey } from "../types/type";

import MobileNav from "../components/MobileNav";
import Game2048 from "../components/Game2048";
import GlobalScoreBar from "../components/GlobalScoreBar";
import Leaderboard from "../components/LeaderBoard";
export default function GamePage() {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();

  // 인증 가드
  useEffect(() => {
    const hasAccess =
      sessionStorage.getItem(SESSION_KEY) === "1" ||
      localStorage.getItem(SESSION_KEY) === "1";
    if (!hasAccess) navigate("/", { replace: true });
    else if (
      localStorage.getItem(SESSION_KEY) === "1" &&
      sessionStorage.getItem(SESSION_KEY) !== "1"
    ) {
      sessionStorage.setItem(SESSION_KEY, "1");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    navigate("/", { replace: true });
  };

  const menu: MenuItem[] = useMemo(
    () => [
      {
        key: "home",
        label: "일정",
        icon: <img src={EYE2} alt="" className="eye-logo" />,
      },
      {
        key: "notice",
        label: "공지",
        icon: <img src={EYE} alt="" className="eye-logo" />,
      },
      { key: "about", label: "천사목록", icon: "👼🏻" },
      {
        key: "gallery",
        label: "디스패치",
        icon: <img src={BASKET} alt="" className="basket-logo" />,
      },
      { key: "download", label: "자료실", icon: "📦" },
    ],
    []
  );

  const [active, setActive] = useState<MenuKey>(
    (menu.find((m) => m.key === tab)?.key as MenuKey) || "home"
  );

  const handleTabChange = (key: MenuKey) => {
    setActive(key);
    navigate(`/${key}`, { replace: true });
  };

  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="pc-layout">
      <Sidebar
        menu={menu}
        active={active}
        onChange={handleTabChange}
        onLogout={handleLogout}
      />
      <MobileNav
        menu={menu}
        active={active}
        onChange={handleTabChange}
        onLogout={handleLogout}
      />
      <main className="pc-main" role="region" aria-live="polite">
        <section className="cardish">
          <GlobalScoreBar goal={2_000_000} refreshKey={refreshKey} />
          <div style={{ marginTop: 12 }}>
            <Leaderboard key={`lb-${refreshKey}`} />
          </div>
        </section>

        <section className="cardish game-card">
          <Game2048 onScoreSubmitted={() => setRefreshKey((k) => k + 1)} />
        </section>
      </main>
    </div>
  );
}
