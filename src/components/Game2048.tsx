import { useCallback, useEffect, useMemo, useState } from "react";
import "./game2048.css";
import GlobalScoreBar from "./GlobalScoreBar";

type Dir = "left" | "right" | "up" | "down";
type Grid = number[][];

const SIZE = 4;

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function cloneGrid(g: Grid): Grid {
  return g.map((row) => row.slice());
}

function gridsEqual(a: Grid, b: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) if (a[r][c] !== b[r][c]) return false;
  }
  return true;
}

function randomEmptyCell(g: Grid): { r: number; c: number } | null {
  const empties: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (g[r][c] === 0) empties.push({ r, c });
    }
  }
  if (empties.length === 0) return null;
  return empties[Math.floor(Math.random() * empties.length)];
}

function addRandomTile(g: Grid): Grid {
  const next = cloneGrid(g);
  const cell = randomEmptyCell(next);
  if (!cell) return next;
  // 90% 2, 10% 4
  next[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function compressAndMergeLine(line: number[]): {
  line: number[];
  gained: number;
} {
  // remove zeros
  const arr = line.filter((x) => x !== 0);
  let gained = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== 0 && arr[i] === arr[i + 1]) {
      arr[i] = arr[i] * 2;
      gained += arr[i];
      arr[i + 1] = 0;
      i++;
    }
  }

  const merged = arr.filter((x) => x !== 0);
  while (merged.length < SIZE) merged.push(0);

  return { line: merged, gained };
}

function rotateGrid(g: Grid): Grid {
  // rotate 90deg clockwise
  const out = emptyGrid();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      out[c][SIZE - 1 - r] = g[r][c];
    }
  }
  return out;
}

function moveLeft(g: Grid): { grid: Grid; gained: number } {
  const out = emptyGrid();
  let gained = 0;
  for (let r = 0; r < SIZE; r++) {
    const { line, gained: add } = compressAndMergeLine(g[r]);
    out[r] = line;
    gained += add;
  }
  return { grid: out, gained };
}

function move(g: Grid, dir: Dir): { grid: Grid; gained: number } {
  // normalize to moveLeft using rotations
  let working = cloneGrid(g);
  let gained = 0;

  const rot = (n: number) => {
    for (let i = 0; i < n; i++) working = rotateGrid(working);
  };

  // Bring direction to "left"
  if (dir === "up") rot(3);
  if (dir === "right") rot(2);
  if (dir === "down") rot(1);

  const res = moveLeft(working);
  working = res.grid;
  gained = res.gained;

  // rotate back
  if (dir === "up") rot(1);
  if (dir === "right") rot(2);
  if (dir === "down") rot(3);

  return { grid: working, gained };
}

function canMove(g: Grid): boolean {
  // any empty
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (g[r][c] === 0) return true;
  // any mergeable neighbors
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = g[r][c];
      if (r + 1 < SIZE && g[r + 1][c] === v) return true;
      if (c + 1 < SIZE && g[r][c + 1] === v) return true;
    }
  }
  return false;
}

function getMaxTile(g: Grid): number {
  let m = 0;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) m = Math.max(m, g[r][c]);
  return m;
}

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(() =>
    addRandomTile(addRandomTile(emptyGrid()))
  );
  const [score, setScore] = useState(0);

  const gameOver = useMemo(() => !canMove(grid), [grid]);
  const maxTile = useMemo(() => getMaxTile(grid), [grid]);

  const reset = useCallback(() => {
    setScore(0);
    setGrid(addRandomTile(addRandomTile(emptyGrid())));
  }, []);

  const doMove = useCallback(
    (dir: Dir) => {
      if (gameOver) return;

      const { grid: moved, gained } = move(grid, dir);
      if (gridsEqual(grid, moved)) return; // no change, don't add tile
      const withTile = addRandomTile(moved);

      setGrid(withTile);
      if (gained) setScore((s) => s + gained);
    },
    [grid, gameOver]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key))
        e.preventDefault();

      if (key === "ArrowLeft") doMove("left");
      if (key === "ArrowRight") doMove("right");
      if (key === "ArrowUp") doMove("up");
      if (key === "ArrowDown") doMove("down");
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown as any);
  }, [doMove]);

  return (
    <div className="g2048">
      <div className="g2048-head">
        <div className="g2048-title">
          <strong>2048</strong>
          <span className="muted">방향키로 조작해줘!</span>
        </div>
        <div className="g2048-stats">
          <div className="g2048-pill">
            <div className="muted">SCORE</div>
            <div className="g2048-num">{score}</div>
          </div>
          <div className="g2048-pill">
            <div className="muted">MAX</div>
            <div className="g2048-num">{maxTile}</div>
          </div>
          <button className="g2048-btn" onClick={reset}>
            리셋
          </button>
        </div>
      </div>

      <div
        className={`g2048-board ${gameOver ? "is-over" : ""}`}
        role="application"
        aria-label="2048 game board"
      >
        {grid.flatMap((row, r) =>
          row.map((v, c) => (
            <div key={`${r}-${c}`} className={`g2048-cell v${v || 0}`}>
              {v !== 0 ? v : ""}
            </div>
          ))
        )}

        {gameOver && (
          <div className="g2048-overlay">
            <div className="g2048-overcard">
              <strong>GAME OVER</strong>
              <p className="muted">더 이상 움직일 수 없어!</p>
              <button className="g2048-btn" onClick={reset}>
                다시하기
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="g2048-controls">
        <button onClick={() => doMove("up")}>▲</button>
        <div>
          <button onClick={() => doMove("left")}>◀</button>
          <button onClick={() => doMove("down")}>▼</button>
          <button onClick={() => doMove("right")}>▶</button>
        </div>
      </div>

      <GlobalScoreBar />
    </div>
  );
}
