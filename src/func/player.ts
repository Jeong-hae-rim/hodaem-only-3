const ID_KEY = "game2048_player_id";
const NICK_KEY = "game2048_nickname";

export function getOrCreatePlayerId() {
  let id = localStorage.getItem(ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ID_KEY, id);
  }
  return id;
}

export function getNickname() {
  return localStorage.getItem(NICK_KEY) ?? "익명";
}

export function setNickname(nick: string) {
  localStorage.setItem(NICK_KEY, nick.trim().slice(0, 12) || "익명");
}
