import { useEffect, useState } from "react";

type Item = {
  rank: number;
  nickname: string;
  totalScore: number;
  playCount: number;
};

export default function Leaderboard() {
  const [mode, setMode] = useState<"score" | "count">("count");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`/api/leaderboard?mode=${mode}&limit=10`)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d?.items) ? d.items : []))
      .catch(() => setItems([]));
  }, [mode]);

  return (
    <div className="leaderboard">
      <div className="leaderboard__head">
        <h3 style={{ margin: 0 }}>🏆 랭킹 TOP 10</h3>
        <div className="leaderboard__tabs">
          <button
            className={`lb-tab ${mode === "count" ? "active" : ""}`}
            onClick={() => setMode("count")}
            type="button"
          >
            횟수
          </button>
          <button
            className={`lb-tab ${mode === "score" ? "active" : ""}`}
            onClick={() => setMode("score")}
            type="button"
          >
            점수
          </button>
        </div>
      </div>

      <div className="leaderboard__list">
        {items.map((it) => (
          <div className="lb-row" key={`${it.rank}-${it.nickname}`}>
            <div className="lb-rank">#{it.rank}</div>
            <div className="lb-name">{it.nickname}</div>
            <div className="lb-metric">
              {mode === "count"
                ? `${it.playCount.toLocaleString()}회`
                : `${it.totalScore.toLocaleString()}pts`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
