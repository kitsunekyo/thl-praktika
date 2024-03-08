import { NextRequest } from "next/server";
import { sendNotification, setVapidDetails } from "web-push";

if (
  !process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
  !process.env.WEB_PUSH_PRIVATE_KEY ||
  !process.env.WEB_PUSH_EMAIL
) {
  throw new Error(
    "NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY, WEB_PUSH_PRIVATE_KEY, and WEB_PUSH_EMAIL must be set in env",
  );
}

setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY,
);

export async function POST(req: NextRequest) {
  const data = await req.json();
  const subscription = data.subscription;

  try {
    await sendNotification(
      subscription,
      JSON.stringify({ title: "Hello", message: "Hello world" }),
    );
    return Response.json(null, { status: 200 });
  } catch (err) {
    return Response.json({ error: err });
  }
}
