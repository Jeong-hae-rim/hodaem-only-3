import "./globalscorebar.css";
import { useEffect, useMemo, useState } from "react";

type Props = {
  goal?: number; // 목표치(없으면 기본값)
  title?: string; // 헤더 문구
  endpoint?: string; // 나중에 API 붙일 때 사용. 기본: /api/score
  fallbackTotal?: number; // API 없을 때 테스트용
};

export default function GlobalScoreBar({
  goal = 2_000_000,
  title = "누적 점수",
  endpoint = "/api/score",
  fallbackTotal = 1_023_456, // ✅ 지금은 테스트용. 나중에 지워도 됨
}: Props) {
  const [total, setTotal] = useState<number>(fallbackTotal);
  const [loading, setLoading] = useState(false);

  // ✅ API 붙이면 자동으로 여기서 총합을 가져옴
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(endpoint, { method: "GET" });
        if (!res.ok) return; // 아직 API 없으면 그냥 fallback 유지
        const data = await res.json();
        const next = Number(data?.total);
        if (alive && Number.isFinite(next)) setTotal(next);
      } catch {
        // API 없거나 실패하면 fallback 유지
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [endpoint]);

  const { pct, remaining } = useMemo(() => {
    const p = goal > 0 ? Math.min(100, Math.floor((total / goal) * 100)) : 0;
    const r = Math.max(0, goal - total);
    return { pct: p, remaining: r };
  }, [goal, total]);

  return (
    <div className="score-bar">
      <div className="score-bar__row">
        <span className="score-bar__title">
          {title}{" "}
          {loading ? (
            <span className="score-bar__loading">· 불러오는 중…</span>
          ) : null}
        </span>
        <strong className="score-bar__total">
          {total.toLocaleString()} pts
        </strong>
      </div>

      <div className="score-bar__track" aria-label="global score progress">
        <div
          className="score-bar__fill"
          style={{ ["--pct" as any]: `${pct}%` }}
        />
      </div>

      <div className="score-bar__meta">
        <span>목표 {goal.toLocaleString()} pts</span>
        <span>
          {pct}% · 남은 점수 {remaining.toLocaleString()} pts
        </span>
      </div>
    </div>
  );
}
