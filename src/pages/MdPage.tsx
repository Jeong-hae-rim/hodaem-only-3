import "./App.css";
import "./SecretPage.css";
import "./mdpage.css";

import COOPER21 from "../assets/images/mdList/mdlist3.png";
import COOPER24 from "../assets/images/cooperWorks/cooper24_2.png";
import COOPER22 from "../assets/images/cooperWorks/cooper22_2.png";
import MDLIST1 from "../assets/images/mdList/mdlist1.png";
import MDLIST2 from "../assets/images/mdList/mdlist2.png";

export default function MdPage() {
  const items = [
    // {
    //   id: 1,
    //   title: "족자봉",
    //   images: COOPER21,
    //   author: "돌 DD님 협력",
    // },
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
    // {
    //   id: 4,
    //   title: "아크릴 마그넷 세트",
    //   images: MDLIST1,
    //   author: "온리전 제작",
    // },
  ];

  return (
    <div className="pc-layout">
      <main className="pc-main" role="region" aria-live="polite">
        <h1>MD LIST</h1>
        <section className="goods-section">
          <div className="goods-divider" />

          <h3>족자봉</h3>

          <img src={COOPER21} className="goods-image4" />

          <h5>돌 DD님 협력</h5>
          <div className="goods-divider" />
        </section>
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

          <h3>아크릴 마그넷 세트</h3>

          <img src={MDLIST1} className="goods-image3" />

          <h5>온리전 제작</h5>
          <div className="goods-divider" />
        </section>

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
