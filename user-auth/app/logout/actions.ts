"use server";
import "server-only";
import { deleteSession } from "../lib/session";

export async function logout() {
    await deleteSession();
}