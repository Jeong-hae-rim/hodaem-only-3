import "./App.css";
import "./SecretPage.css";
import BASKET from "../assets/images/eye2.png";
import EYE from "../assets/images/eye1.png";
import EYE2 from "../assets/images/eye3.png";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SESSION_KEY } from "../func/constants";
import SectionRenderer from "../components/SectionRenderer";
import Sidebar from "../components/Sidebar";
import type { MenuItem, MenuKey } from "../types/type";
// import PuzzleHUD from "../components/PuzzleHUD";
import VNModal from "../components/VNModal";
import { loadCollected, markCollected } from "../func/puzzle";
import type { VNOpenPayload } from "../func/vnEvents";

import MobileNav from "../components/MobileNav";
import { PuzzleContext } from "../func/puzzleStore";

export default function SecretPage() {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();

  const [vn, setVn] = useState<VNOpenPayload | null>(null);
  const [open, setOpen] = useState(false);
  const [collected, setCollected] = useState(() => loadCollected());

  // 인증 가드

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ev = e as CustomEvent<VNOpenPayload>;
      setVn(ev.detail);
      setOpen(true);
    };
    window.addEventListener("vn:open", onOpen);
    return () => window.removeEventListener("vn:open", onOpen);
  }, []);

  const isCollected = !!(vn?.key && collected[vn.key]);

  const handleCollect = () => {
    if (!vn?.key) return;
    const next = markCollected(collected, vn.key);
    setCollected(next);
  };

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
      { key: "secret_angels", label: "천사목록", icon: "👼🏻" },
      // {
      //   key: "booth_info",
      //   label: "결사대원목록",
      //   icon: <img src={EYE2} alt="" className="eye-logo" />,
      // },
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
        <PuzzleContext.Provider value={collected}>
          {/* <PuzzleHUD /> */}
          <VNModal
            open={open}
            onClose={() => setOpen(false)}
            title={vn?.title}
            imageSrc={vn?.imageSrc ?? ""}
            speaker={vn?.speaker ?? "??"}
            lines={vn?.lines ?? [""]}
            onCollect={vn?.key ? handleCollect : undefined}
            collected={isCollected}
          />
          <SectionRenderer active={active} />
        </PuzzleContext.Provider>
      </main>
    </div>
  );
}
