import { createPublicClient, createAdminClient } from "./supabase/server";

export interface Project {
  id: string; // uuid
  title: string;
  type: string;
  embed_url: string;
  thumbnail_url: string | null;
  vertical: boolean;
  col_span: string; // e.g. 'col-span-4' or 'col-span-6' or 'col-span-3'
  aspect: string; // e.g. 'aspect-[9/16]' or 'aspect-video'
  gradient: string; // e.g. 'from-[#0a001a] via-[#1a0033] to-[#0a0010]'
  sort_order: number;
  published: boolean;
  created_at: string;
}

/**
 * Extracts a YouTube Video ID from standard YouTube formats
 */
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  
  // embed format: https://www.youtube.com/embed/ABC1234
  const embedMatch = url.match(/embed\/([^/?#\s]+)/);
  if (embedMatch) return embedMatch[1];

  // watch format: https://www.youtube.com/watch?v=ABC1234
  const watchMatch = url.match(/[?&]v=([^&#\s]+)/);
  if (watchMatch) return watchMatch[1];

  // short format: https://youtu.be/ABC1234
  const shortMatch = url.match(/youtu\.be\/([^/?#\s]+)/);
  if (shortMatch) return shortMatch[1];

  return null;
}

/**
 * Gets automatic YouTube high-quality thumbnail matching the video URL.
 * Uses maxresdefault.jpg (1280x720 / 1920x1080) for pristine quality and no letterboxes.
 */
export function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "";
}

/**
 * Fetches all published projects (anonymous public reading)
 */
export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error reading projects:", error);
      return [];
    }

    return (data as Project[]) || [];
  } catch (err) {
    console.error("Supabase client connection failed:", err);
    return [];
  }
}

/**
 * Fetches all projects (requires admin access, bypasses RLS)
 */
export async function getAllProjects(): Promise<Project[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as Project[]) || [];
}

/**
 * Inserts a new project into Supabase (requires admin access)
 */
export async function createProject(project: Omit<Project, "id" | "created_at">): Promise<Project> {
  const supabase = createAdminClient();
  const rawThumbnail = project.thumbnail_url?.trim();
  const derivedThumbnail = rawThumbnail || getYouTubeThumbnail(project.embed_url);

  const { data, error } = await supabase
    .from("projects")
    .insert([{
      ...project,
      thumbnail_url: derivedThumbnail || null,
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Project;
}

/**
 * Updates an existing project in Supabase (requires admin access)
 */
export async function updateProject(id: string, project: Partial<Omit<Project, "id" | "created_at">>): Promise<Project> {
  const supabase = createAdminClient();
  
  let updatedThumbnail = project.thumbnail_url;
  // If the embed url changed and thumbnail was not manually specified, recalculate auto-thumbnail
  if (project.embed_url && !project.thumbnail_url) {
    updatedThumbnail = getYouTubeThumbnail(project.embed_url);
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      ...project,
      thumbnail_url: updatedThumbnail || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Project;
}

/**
 * Deletes a project from Supabase (requires admin access)
 */
export async function deleteProject(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
