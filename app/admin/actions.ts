/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyCredentials, signSession, verifySession } from "@/lib/auth";
import { createProject, updateProject, deleteProject } from "@/lib/projects";

/**
 * Checks if the current request is authenticated
 */
async function checkAuth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) {
    throw new Error("Unauthorized");
  }
  const session = await verifySession(sessionToken);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Handle admin login credentials verification and set cookie
 */
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const isValid = verifyCredentials(email, password);
  if (!isValid) {
    return { error: "Invalid email or password." };
  }

  // Create session (expires in 7 days)
  const duration = 7 * 24 * 60 * 60 * 1000;
  const expiresAt = Date.now() + duration;
  const token = await signSession(email, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set({
    name: "admin_session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  });

  redirect("/admin");
}

/**
 * Handle admin logout and clear cookie
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

/**
 * Server action to create or update a project
 */
export async function saveProjectAction(projectId: string | null, data: {
  title: string;
  type: string;
  embed_url: string;
  thumbnail_url: string;
  vertical: boolean;
  col_span: string;
  aspect: string;
  gradient: string;
  sort_order: number;
  published: boolean;
}) {
  await checkAuth();

  try {
    if (projectId) {
      await updateProject(projectId, data);
    } else {
      await createProject(data);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save project." };
  }
}

/**
 * Server action to delete a project
 **/
export async function deleteProjectAction(projectId: string) {
  await checkAuth();

  try {
    await deleteProject(projectId);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete project." };
  }
}
