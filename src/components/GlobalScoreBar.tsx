import "./globalscorebar.css";
import { useEffect, useMemo, useState } from "react";

type Props = {
  goal?: number;
  refreshKey?: number;
  endpoint?: string;
};

export default function GlobalScoreBar({
  goal = 2_000_000,
  refreshKey = 0,
  endpoint = "/api/score",
}: Props) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch(endpoint)
      .then((r) => r.json())
      .then((d) => {
        const n = Number(d?.total);
        if (alive && Number.isFinite(n)) setTotal(n);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [endpoint, refreshKey]);

  const pct = useMemo(() => {
    if (goal <= 0) return 0;
    return Math.min(100, Math.floor((total / goal) * 100));
  }, [goal, total]);

  return (
    <div className="score-bar">
      <div className="score-bar__row">
        <span className="score-bar__title">누적 점수</span>
        <strong className="score-bar__total">
          {total.toLocaleString()} pts
        </strong>
      </div>

      <div className="score-bar__track">
        <div
          className="score-bar__fill"
          style={{ ["--pct" as any]: `${pct}%` }}
        />
      </div>

      <div className="score-bar__meta">
        <span>목표 {goal.toLocaleString()} pts</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}
