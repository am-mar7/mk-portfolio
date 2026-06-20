import { getAllProjects } from "@/lib/projects";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    const projects = await getAllProjects();
    return <DashboardClient initialProjects={projects} />;
  } catch (error: any) {
    console.error("Database connection/query error in AdminPage:", error);

    const errorCode = error?.code || "UNKNOWN";
    const errorMessage = error?.message || String(error);
    const errorDetails = error?.details || "None";
    const errorHint = error?.hint || "None";

    return (
      <div className="min-h-screen bg-(--background) text-white font-sans flex items-center justify-center p-6">
        <div className="relative w-full max-w-2xl bg-(--surface) border border-red-500/20 p-8 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-0.75 bg-red-500" />

          <div className="mb-6">
            <p className="font-mono text-[10px] tracking-[4px] uppercase text-red-500 mb-2">
              // Runtime Engine Error
            </p>
            <h1 className="font-display text-4xl tracking-[1px] text-white">DATABASE SETUP REQUIRED</h1>
          </div>

          <p className="text-sm text-(--muted) mb-6 leading-relaxed">
            We encountered a connection or query issue while communicating with your Supabase instance. This usually happens if the <strong className="text-white">projects</strong> table has not been created yet in the database, or if your environmental credentials are misconfigured.
          </p>

          <div className="bg-black/40 border border-(--border) p-5 font-mono text-xs rounded-sm space-y-2 mb-6 overflow-x-auto text-red-400">
            <div><span className="text-(--muted)">Error Code:</span> {errorCode}</div>
            <div><span className="text-(--muted)">Message:</span> {errorMessage}</div>
            <div><span className="text-(--muted)">Details:</span> {String(errorDetails)}</div>
            <div><span className="text-(--muted)">Hint:</span> {String(errorHint)}</div>
          </div>

          <div className="space-y-4">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-white border-b border-(--border) pb-1">// Action steps to resolve:</h3>
            <ol className="list-decimal list-inside space-y-2 font-mono text-[10px] text-(--muted) uppercase tracking-wide">
              <li>Open your <a href="https://database.supabase.com" target="_blank" rel="noopener noreferrer" className="text-(--accent) underline hover:opacity-80">Supabase Dashboard ↗</a></li>
              <li>Go to the <strong className="text-white">SQL Editor</strong> page</li>
              <li>Copy all code from the <strong className="text-white">supabase/schema.sql</strong> file in this project</li>
              <li>Paste the code into the SQL editor and click the <strong className="text-white">Run</strong> button</li>
              <li>Confirm your credentials match in your <strong className="text-white">.env.local</strong>, then refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
}
