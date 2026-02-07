export const config = { runtime: "nodejs" };

import { createClient } from "@libsql/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (!url || !token) {
      return res.status(500).json({
        ok: false,
        error:
          "Missing TURSO env vars (TURSO_DATABASE_URL / TURSO_AUTH_TOKEN).",
      });
    }

    const db = createClient({ url, authToken: token });

    const mode = String(req.query.mode ?? "score"); // score | count
    const limitRaw = Number(req.query.limit ?? 10);
    const limit = Math.min(
      50,
      Math.max(5, Number.isFinite(limitRaw) ? limitRaw : 10)
    );

    const orderBy =
      mode === "count"
        ? "play_count DESC, total_score DESC, updated_at DESC"
        : "total_score DESC, play_count DESC, updated_at DESC";

    const r = await db.execute(`
      SELECT nickname, total_score, play_count
      FROM players
      ORDER BY ${orderBy}
      LIMIT ${limit}
    `);

    const items = r.rows.map((row: any, idx: number) => ({
      rank: idx + 1,
      nickname: String(row.nickname ?? "익명"),
      totalScore: Number(row.total_score ?? 0),
      playCount: Number(row.play_count ?? 0),
    }));

    return res.status(200).json({ ok: true, items });
  } catch (e: any) {
    return res
      .status(500)
      .json({ ok: false, error: e?.message ?? "server error" });
  }
}
