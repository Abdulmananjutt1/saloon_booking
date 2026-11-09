// ─────────────────────────────────────────────────────────
//  Web Push Service — Glamour Studio
// ─────────────────────────────────────────────────────────

import webpush from "web-push";
import prisma from "../db";

export interface PushPayload {
  title:   string;
  body:    string;
  icon?:   string;
  badge?:  string;
  tag?:    string;
  url?:    string;
  data?:   Record<string, unknown>;
}

// Lazy init — only called at runtime, never at build time
let initialized = false;
function initVapid() {
  if (initialized) return;
  const pub   = process.env.VAPID_PUBLIC_KEY  ?? "";
  const priv  = process.env.VAPID_PRIVATE_KEY ?? "";
  const email = process.env.VAPID_EMAIL       ?? "mailto:admin@glamourstudio.com";
  if (pub && priv) {
    webpush.setVapidDetails(email, pub, priv);
    initialized = true;
  }
}

async function sendToSubscription(
  sub: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload,
): Promise<boolean> {
  try {
    initVapid();
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
    );
    return true;
  } catch (err: any) {
    if (err?.statusCode === 410 || err?.statusCode === 404) {
      await prisma.pushSubscription
        .delete({ where: { endpoint: sub.endpoint } })
        .catch(() => {});
    }
    return false;
  }
}

export async function notifyAdmins(payload: PushPayload): Promise<void> {
  try {
    const subs = await prisma.pushSubscription.findMany({ where: { role: "admin" } });
    await Promise.allSettled(subs.map((s) => sendToSubscription(s, payload)));
  } catch (err) {
    console.error("[Push] notifyAdmins error:", err);
  }
}

export async function notifyClient(email: string, payload: PushPayload): Promise<void> {
  try {
    const subs = await prisma.pushSubscription.findMany({
      where: { email: email.toLowerCase() },
    });
    await Promise.allSettled(subs.map((s) => sendToSubscription(s, payload)));
  } catch (err) {
    console.error("[Push] notifyClient error:", err);
  }
}

export async function notifyAll(payload: PushPayload): Promise<void> {
  try {
    const subs = await prisma.pushSubscription.findMany();
    await Promise.allSettled(subs.map((s) => sendToSubscription(s, payload)));
  } catch (err) {
    console.error("[Push] notifyAll error:", err);
  }
}
