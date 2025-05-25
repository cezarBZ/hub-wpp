import { WAMessage } from "baileys";
import { mediaTypes } from "../interfaces/media.types";

type MediaMeta = {
  mediaUrl?: string;
  mimeType?: string;
  fileName?: string;
  duration?: number;
  stickerEmoji?: string;
};

export function extractMediaMeta(
  msg: WAMessage | null | undefined,
  type: mediaTypes
) {
  const m = msg?.message;
  if (!m || !(type in m)) return;

  const media = (m as any)[type];
  if (!media) return;

  const meta: MediaMeta = {
    mediaUrl: media.url,
    mimeType: media.mimetype,
  };

  if ("fileName" in media) meta.fileName = media.fileName;
  if ("seconds" in media) meta.duration = media.seconds;
  if ("emoji" in media) meta.stickerEmoji = media.emoji;

  return meta;
}
