export const config = { runtime: "nodejs" };

import { createClient } from "@libsql/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const MAX_SCORE = 1_000_000;
const MAX_NICK = 12;

function withTimeout<T>(p: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error(`timeout ${ms}ms`)), ms)
    ),
  ]);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const started = Date.now();

  try {
    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    console.log("[score] start", req.method, req.url);

    if (!url || !token) {
      console.log("[score] missing env", { url: !!url, token: !!token });
      return res.status(500).json({
        ok: false,
        error:
          "Missing TURSO env vars (TURSO_DATABASE_URL / TURSO_AUTH_TOKEN).",
      });
    }

    // 🔥 libsql://인지 확인용 로그(값 전체는 안 찍음)
    console.log("[score] env ok", {
      urlPrefix: url.slice(0, 8),
      tokenLen: token.length,
      ms: Date.now() - started,
    });

    const db = createClient({ url, authToken: token });

    if (req.method === "GET") {
      console.log("[score] GET before db", { ms: Date.now() - started });

      const r = await withTimeout(
        db.execute("SELECT value FROM stats WHERE key='total_score'"),
        8000
      );

      console.log("[score] GET after db", { ms: Date.now() - started });

      const total = Number(r.rows[0]?.value ?? 0);
      return res.status(200).json({ ok: true, total });
    }

    if (req.method === "POST") {
      const body = (req.body ?? {}) as any;

      const score = Math.floor(Number(body.score));
      const playerId = String(body.playerId ?? "");
      const nicknameRaw = String(body.nickname ?? "익명");
      const nickname = nicknameRaw.trim().slice(0, MAX_NICK) || "익명";

      if (!playerId || playerId.length > 64) {
        return res.status(400).json({ ok: false, error: "invalid playerId" });
      }
      if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
        return res.status(400).json({ ok: false, error: "invalid score" });
      }

      console.log("[score] POST before db", { ms: Date.now() - started });

      await withTimeout(
        db.execute({
          sql: "INSERT INTO scores(player_id, nickname, score) VALUES (?, ?, ?)",
          args: [playerId, nickname, score],
        }),
        8000
      );

      await withTimeout(
        db.execute({
          sql: "UPDATE stats SET value = value + ? WHERE key='total_score'",
          args: [score],
        }),
        8000
      );

      await withTimeout(
        db.execute({
          sql: `
            INSERT INTO players(player_id, nickname, total_score, play_count, updated_at)
            VALUES (?, ?, ?, 1, datetime('now'))
            ON CONFLICT(player_id) DO UPDATE SET
              nickname = excluded.nickname,
              total_score = players.total_score + excluded.total_score,
              play_count = players.play_count + 1,
              updated_at = datetime('now')
          `,
          args: [playerId, nickname, score],
        }),
        8000
      );

      console.log("[score] POST after db", { ms: Date.now() - started });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ ok: false, error: "method not allowed" });
  } catch (e: any) {
    console.log("[score] error", e?.message ?? e, { ms: Date.now() - started });
    return res
      .status(500)
      .json({ ok: false, error: e?.message ?? "server error" });
  }
}
