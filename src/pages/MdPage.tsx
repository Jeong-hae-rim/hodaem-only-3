import "./SecretPage.css";
import "./mdpage.css";
import BASKET from "../assets/images/eye2.png";
import EYE from "../assets/images/eye1.png";
import EYE2 from "../assets/images/eye3.png";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SESSION_KEY } from "../func/constants";
import Sidebar from "../components/Sidebar";
import type { MenuItem, MenuKey } from "../types/type";

import MobileNav from "../components/MobileNav";

import COOPER21 from "../assets/images/mdList/mdlist3.png";
import COOPER24 from "../assets/images/cooperWorks/cooper24_2.png";
import COOPER22 from "../assets/images/cooperWorks/cooper22_2.png";
import MDLIST1 from "../assets/images/mdList/mdlist1.png";
import MDLIST2 from "../assets/images/mdList/mdlist2.png";

export default function MdPage() {
  // const navigate = useNavigate();
  // const { tab } = useParams<{ tab?: string }>();

  // const handleLogout = () => {
  //   sessionStorage.removeItem(SESSION_KEY);
  //   localStorage.removeItem(SESSION_KEY);
  //   navigate("/", { replace: true });
  // };

  // const menu: MenuItem[] = useMemo(
  //   () => [
  //     {
  //       key: "home",
  //       label: "일정",
  //       icon: <img src={EYE2} alt="" className="eye-logo" />,
  //     },
  //     {
  //       key: "notice",
  //       label: "공지",
  //       icon: <img src={EYE} alt="" className="eye-logo" />,
  //     },
  //     { key: "secret_angels", label: "천사목록", icon: "👼🏻" },
  //     {
  //       key: "gallery",
  //       label: "디스패치",
  //       icon: <img src={BASKET} alt="" className="basket-logo" />,
  //     },
  //     { key: "download", label: "자료실", icon: "📦" },
  //   ],
  //   []
  // );

  // const [active, setActive] = useState<MenuKey>(
  //   (menu.find((m) => m.key === tab)?.key as MenuKey) || "home"
  // );

  // const handleTabChange = (key: MenuKey) => {
  //   setActive(key);
  //   navigate(`/${key}`, { replace: true });
  // };

  const items = [
    {
      id: 1,
      title: "족자봉",
      images: COOPER21,
      author: "돌 DD님 협력",
    },
    {
      id: 2,
      title: "회전 아크릴 스탠드",
      images: COOPER24,
      author: "른짝님 협력",
    },
    {
      id: 3,
      title: "아크릴 스탠드(일반)",
      images: COOPER22,
      author: "잡곡밥님 협력",
    },
    {
      id: 4,
      title: "아크릴 마그넷 세트",
      images: MDLIST1,
      author: "온리전 제작",
    },
    // {
    //   id: 5,
    //   title: "아크릴 뱃지",
    //   images: MDLIST2,
    //   author: "온리전 제작",
    // },
  ];

  return (
    <div className="pc-layout">
      {/* <Sidebar
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
      /> */}
      <main className="pc-main" role="region" aria-live="polite">
        {items.map((item) => (
          <section className="goods-section" key={item.id}>
            <div className="goods-divider" />

            <h3>{item.title}</h3>

            {item.images ? (
              <img src={item.images} alt={item.title} className="goods-image" />
            ) : (
              "준비 중입니다."
            )}

            <h5>{item.author}</h5>
            <div className="goods-divider" />
          </section>
        ))}

        <section className="goods-section">
          <div className="goods-divider" />

          <h3>아크릴 뱃지</h3>

          <img src={MDLIST2} className="goods-image2" />

          <h5>온리전 제작</h5>
          <div className="goods-divider" />
        </section>
      </main>
    </div>
  );
}
