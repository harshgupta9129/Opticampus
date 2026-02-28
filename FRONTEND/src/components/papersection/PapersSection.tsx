import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Stepper from "./Stepper";
import {
  Download, FileText, Search, RotateCcw, Library,
  Loader2, ChevronDown, BookOpen, Filter, Upload, User,
  ArrowRight, ShieldCheck
} from "lucide-react";
import Header from "../landing/Header";
import Footer from "../landing/Footer";

// --- Types ---
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
  status: string;
}

interface SelectionState {
  year: string;
  sem: string;
  branch: string;
  examType: string;
}

interface OptionsState {
  years: string[];
  sems: string[];
  branches: string[];
  examTypes: string[];
}

export default function PapersSection() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selection, setSelection] = useState<SelectionState>({ year: "", sem: "", branch: "", examType: "" });
  const [options, setOptions] = useState<OptionsState>({ years: [], sems: [], branches: [], examTypes: [] });
  const [papers, setPapers] = useState<Paper[] | null>(null);
  const [subjectMap] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  const steps = [
    { id: 1, title: "Year" },
    { id: 2, title: "Semester" },
    { id: 3, title: "Branch" },
    { id: 4, title: "View Papers" },
  ];

  useEffect(() => {
    document.title = "OptiCampus Resources | Previous Year Papers";
  }, []);

  // DATA INITIALIZATION
  useEffect(() => {
    const fetchMetadata = async () => {
      const { data: yearData } = await supabase
        .from('papers')
        .select('year')
        .eq('status', 'verified');

      if (yearData) {
        const uniqueYears = Array.from(new Set(yearData.map((item: { year: string }) => item.year))).sort().reverse();
        setOptions(prev => ({ ...prev, years: uniqueYears }));
      }
    };
    fetchMetadata();
  }, []);

  const getSubjectTitle = (courseCode: string): string => {
    if (!subjectMap || Object.keys(subjectMap).length === 0) return courseCode;
    const normalizedCode = courseCode.toUpperCase().trim();
    return subjectMap[normalizedCode] || "General Paper";
  };

  const filteredPapers = useMemo(() => {
    if (!papers) return [];
    return papers.filter((paper) =>
      paper.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getSubjectTitle(paper.course_code).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (paper.uploaded_by && paper.uploaded_by.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [papers, searchQuery, subjectMap]);

  const handleDownload = async (fileUrl: string, courseCode: string, branch: string, sem: string | number, year: string) => {
    if (!fileUrl) return;
    const fileName = (courseCode && branch && sem && year)
      ? `${courseCode}_${branch}_${sem}_${year}_OPTICAMPUS.pdf`
      : "OPTICAMPUS_Resource.pdf";

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      window.open(fileUrl, "_blank");
    }
  };

  // --- DROPDOWN LOGIC ---
  const handleYearChange = async (year: string) => {
    setSelection({ year, sem: "", branch: "", examType: "" });
    setPapers(null);
    setCurrentStep(2);
    if (!year) return;

    setLoading(true);
    const { data } = await supabase
      .from('papers')
      .select('sem')
      .eq('status', 'verified')
      .eq('year', year);

    if (data) {
      const uniqueSems = Array.from(new Set(data.map((item: { sem: string }) => item.sem))).sort();
      setOptions(prev => ({ ...prev, sems: uniqueSems }));
    }
    setLoading(false);
  };

  const handleSemChange = async (sem: string) => {
    setSelection(prev => ({ ...prev, sem, branch: "", examType: "" }));
    if (!sem) return;

    setLoading(true);
    const { data } = await supabase
      .from('papers')
      .select('branch')
      .eq('status', 'verified')
      .eq('year', selection.year)
      .eq('sem', sem);

    if (data) {
      const uniqueBranches = Array.from(new Set(data.map((item: { branch: string }) => item.branch))).sort();
      setOptions(prev => ({ ...prev, branches: uniqueBranches }));
      setCurrentStep(3);
    }
    setLoading(false);
  };

  const handleBranchChange = async (branch: string) => {
    setSelection(prev => ({ ...prev, branch, examType: "" }));
    if (!branch) return;

    setLoading(true);
    const { data } = await supabase
      .from('papers')
      .select('exam_type')
      .eq('status', 'verified')
      .eq('year', selection.year)
      .eq('sem', selection.sem)
      .eq('branch', branch);

    if (data) {
      const uniqueTypes = Array.from(new Set(data.map((item: { exam_type: string }) => item.exam_type))).sort();
      setOptions(prev => ({ ...prev, examTypes: uniqueTypes }));
      setCurrentStep(4);
    }
    setLoading(false);
  };

  const fetchFinalPapers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('papers')
      .select('*')
      .eq('status', 'verified')
      .eq('year', selection.year)
      .eq('sem', selection.sem)
      .eq('branch', selection.branch)
      .eq('exam_type', selection.examType);

    if (error) {
      console.error("Fetch error:", error);
      setPapers([]);
    } else {
      setPapers(data as Paper[] || []);
      setCurrentStep(5);
    }
    setLoading(false);
  };

  return (
    <article className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-800 flex flex-col">
      <Header />

      {/* HEADER HERO SECTION */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-6 shadow-sm">
            <Library size={14} /> Academic Archive
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Academic <span className="text-emerald-600 relative">
              Repository
              <svg className="absolute w-full h-2.5 -bottom-1 left-0 text-emerald-200/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
            Access the official collection of previous year question papers. Optimized for quick revision, accessibility, and sustainable paperless study.
          </p>
          {/* ACTION BUTTONS CONTAINER */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">

            {/* Existing Contribute Button */}
            <Link
              to="/uploadpaper"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-emerald-200 hover:-translate-y-1 group min-w-[200px] justify-center"
            >
              <Upload size={16} className="text-emerald-400 group-hover:text-white transition-colors" />
              Contribute Resource
            </Link>

            {/* New Archive Admin Button */}
            <Link
              to="/archiveadmin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group min-w-[200px] justify-center"
            >
              <ShieldCheck size={16} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
              Archive Admin
            </Link>

          </div>
        </div>

        {/* Stepper Integration */}
        <div className="mt-12">
          <Stepper currentStep={currentStep} steps={steps} />
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <section className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT FILTER PANEL - STICKY */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28 z-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2 uppercase tracking-wide">
                  <Filter size={16} className="text-emerald-600" /> Filter Archive
                </h3>
                {selection.year && (
                  <button
                    onClick={() => { setSelection({ year: "", sem: "", branch: "", examType: "" }); setPapers(null); setCurrentStep(1); }}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <CustomDropdown label="Academic Year" value={selection.year} options={options.years} onChange={handleYearChange} />
                <CustomDropdown label="Semester" value={selection.sem} options={options.sems} onChange={handleSemChange} disabled={!selection.year} />
                <CustomDropdown label="Branch / Stream" value={selection.branch} options={options.branches} onChange={handleBranchChange} disabled={!selection.sem} />
                <CustomDropdown label="Exam Category" value={selection.examType} options={options.examTypes} onChange={(val) => setSelection(p => ({ ...p, examType: val }))} disabled={!selection.branch} />
              </div>
            </div>

            <button
              onClick={fetchFinalPapers}
              disabled={!selection.examType || loading}
              className="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100 hover:shadow-emerald-200 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Accessing Vault...</span>
                </>
              ) : (
                <>
                  <span>Unlock Papers</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="lg:col-span-8 min-h-[600px]">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 h-full shadow-sm relative overflow-hidden flex flex-col">

            {/* Toolbar / Search Header */}
            {papers && papers.length > 0 && (
              <div className="mb-8 relative animate-in slide-in-from-top-2 duration-500 z-10">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search by subject code, name, or uploader..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Content States */}
            <div className="flex-grow">
              {!papers ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-80 animate-in zoom-in-95 duration-500 py-20">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <BookOpen size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Explore</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                    Select your parameters from the filter panel to unlock the document vault.
                  </p>
                </div>
              ) : filteredPapers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} className="text-red-300" />
                  </div>
                  <p className="text-slate-900 font-bold mb-1">No documents found</p>
                  <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                  <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-1">Archive Results</h3>
                      <p className="text-slate-600 text-sm font-bold flex items-center gap-2">
                        {selection.branch}
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        Semester {selection.sem}
                        <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">
                          {filteredPapers.length} Papers
                        </span>
                      </p>
                    </div>
                    <button onClick={() => { setPapers(null); setSelection({ year: "", sem: "", branch: "", examType: "" }); setCurrentStep(1); }}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all" title="Clear Filters">
                      <RotateCcw size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {filteredPapers.map((data) => (
                      <div
                        key={data.id}
                        onClick={() => handleDownload(data.file_url, data.course_code, data.branch, data.sem, data.year)}
                        className="relative flex items-center justify-between p-5 bg-white border border-slate-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 group"
                      >
                        <div className="flex items-center gap-5 min-w-0">
                          {/* Icon Box */}
                          <div className="shrink-0 p-4 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                            <FileText size={24} />
                          </div>

                          {/* Text Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 group-hover:border-emerald-200 transition-colors">
                                {data.course_code}
                              </span>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                {data.year}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 truncate transition-colors">
                              {getSubjectTitle(data.course_code)}
                            </h4>
                            <div className="mt-1.5 flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <User size={12} />
                                <span className="text-[11px] font-medium uppercase tracking-wide truncate max-w-[100px]">
                                  {data.uploaded_by || "Administrator"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Download Action */}
                        <div className="shrink-0 pl-4">
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-110">
                            <Download size={20} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </section>
      <Footer />
    </article>
  );
}

// Sub-component for Dropdowns
interface CustomDropdownProps {
  label: string;
  value: string | number | undefined;
  options: (string | number)[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function CustomDropdown({ label, value, options, onChange, disabled }: CustomDropdownProps) {
  return (
    <div className={`transition-all duration-300 ${disabled ? "opacity-50 grayscale pointer-events-none" : "opacity-100"}`}>
      <label className="text-xs font-bold text-slate-500 mb-1.5 block pl-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative group/select">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none appearance-none cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm"
        >
          <option value="">Select {label}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover/select:text-emerald-500 transition-colors pointer-events-none" />
      </div>
    </div>
  );
}