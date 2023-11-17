"use server";
import { getServerSession as NEXT_getServerSession } from "next-auth";

import { authOptions } from "./next-auth";

export async function getServerSession() {
  return NEXT_getServerSession(authOptions);
}
