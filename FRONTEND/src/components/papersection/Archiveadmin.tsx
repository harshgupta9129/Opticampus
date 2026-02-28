import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  ShieldCheck, FileText, Check, X, Loader2,
  Trash2, AlertCircle, RefreshCw, LayoutDashboard, Lock, LogIn
} from "lucide-react";
import Footer from "../landing/Footer";

interface Paper {
  id: string;
  title: string;
  course_code: string;
  branch: string;
  sem: number | string;
  year: string;
  exam_type: string;
  file_url: string;
  uploaded_by?: string;
  created_at: string;
}

export default function ArchiveAdmin() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // AUTH STATE CHECK
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- LOGIN COMPONENT (Internal) ---
  const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setError(error.message);
      setLoading(false);
    };

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Admin Access</h2>
            <p className="text-slate-500 text-sm mt-2">Authenticate to manage the archive.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-800"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
              <span>Authenticate</span>
            </button>
          </form>
        </div>
      </div>
    );
  };

  // --- MAIN DASHBOARD LOGIC ---
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
        document.title = "Admin Console | OptiCampus";
        fetchPendingPapers();
    }
  }, [session]);

  const fetchPendingPapers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('papers')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching papers:", error);
    else setPapers(data as Paper[] || []);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('papers')
        .update({ status: 'verified' })
        .eq('id', id);

      if (error) throw error;
      setPapers(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve paper.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string, fileUrl: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this file?")) return;
    
    setActionLoading(id);
    try {
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('pdfs').remove([fileName]);
      }
      const { error: dbError } = await supabase.from('papers').delete().eq('id', id);
      if (dbError) throw dbError;
      setPapers(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Failed to delete paper.");
    } finally {
      setActionLoading(null);
    }
  };

  // 1. Loading State (Checking Session)
  if (authLoading) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>
    );
  }

  // 2. Not Logged In -> Show Login Screen
  if (!session) {
    return <AdminLogin />;
  }

  // 3. Logged In -> Show Dashboard
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} /> Admin Access
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Archive <span className="text-emerald-600">Console</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Review and manage pending resource contributions.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-2xl font-black text-slate-800">{papers.length}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
             </div>
             <button 
               onClick={fetchPendingPapers}
               className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md transition-all active:scale-95"
               title="Refresh List"
             >
               <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
             </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-60">
            <Loader2 size={40} className="animate-spin text-emerald-600 mb-4" />
            <p className="text-slate-500 font-medium">Loading requests...</p>
          </div>
        ) : papers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <LayoutDashboard size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">All Caught Up!</h3>
            <p className="text-slate-500 mt-2 text-sm">There are no pending papers to verify.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {papers.map((paper) => (
              <div 
                key={paper.id} 
                className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Paper Info */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                        {paper.course_code}
                      </span>
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                         {paper.branch} • Sem {paper.sem}
                      </span>
                      <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                         <AlertCircle size={10} /> Pending
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-800 truncate" title={paper.title}>
                      {paper.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-4 text-xs font-medium text-slate-400">
                      <span>Uploaded by: <span className="text-slate-600">{paper.uploaded_by || "Unknown"}</span></span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{new Date(paper.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                  <a 
                    href={paper.file_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 md:flex-none py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors text-center border border-slate-200"
                  >
                    Preview
                  </a>
                  
                  <button
                    onClick={() => handleReject(paper.id, paper.file_url)}
                    disabled={actionLoading === paper.id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === paper.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    <span className="md:hidden lg:inline">Reject</span>
                  </button>

                  <button
                    onClick={() => handleApprove(paper.id)}
                    disabled={actionLoading === paper.id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {actionLoading === paper.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    <span className="md:hidden lg:inline">Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}