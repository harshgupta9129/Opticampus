import React, { useState, useMemo, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  Loader2, FileCheck, Image as ImageIcon,
  ChevronLeft, CloudUpload, ShieldCheck, User, Code,
  ChevronDown, AlertCircle, FileText
} from "lucide-react";
import { jsPDF } from "jspdf";
import Header from "../landing/Header";
import Footer from "../landing/Footer";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadMeta {
  year: string;
  sem: string;
  branch: string;
  examType: string;
  courseCode: string;
  uploadedBy: string;
}

interface ImageProcessingResult {
  src: string;
  w: number;
  h: number;
}

export default function PaperUpload() {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [meta, setMeta] = useState<UploadMeta>({
    year: "", sem: "", branch: "", examType: "",
    courseCode: "", uploadedBy: "OptiCampus User"
  });

  useEffect(() => {
    document.title = "Upload Resource | OptiCampus";
  }, []);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setError("");
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > MAX_FILE_SIZE) {
      setError(`File size limit exceeded. Current: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);
      setFiles([]);
      e.target.value = ""; 
      return;
    }
    setFiles(selectedFiles);
  };

  const processImage = (file: File): Promise<ImageProcessingResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDimension = 1400;
          const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d", { alpha: false });
          if (ctx) {
             ctx.imageSmoothingEnabled = true;
             ctx.imageSmoothingQuality = 'medium';
             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
             resolve({
               src: canvas.toDataURL("image/jpeg", 0.75),
               w: canvas.width,
               h: canvas.height
             });
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const convertImagesToPdf = async (imageFiles: File[]) => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const resolvedImages = await Promise.all(imageFiles.map(file => processImage(file)));

    resolvedImages.forEach((imgData, i) => {
      if (i > 0) doc.addPage();
      const ratio = Math.min(pageWidth / imgData.w, pageHeight / imgData.h);
      const imgWidth = imgData.w * ratio;
      const imgHeight = imgData.h * ratio;
      doc.addImage(imgData.src, "JPEG", (pageWidth - imgWidth) / 2, 2, imgWidth, imgHeight, undefined, 'MEDIUM');
    });

    return doc.output("blob");
  };

  const handleUpload = async () => {
    setError("");
    if (meta.courseCode.length !== 6) { setError("Course Code must be 6 characters."); return; }
    if (files.length === 0 || !meta.year || !meta.sem || !meta.branch || !meta.examType) { setError("Please fill all required fields."); return; }

    setLoading(true);

    try {
      const standardizedName = `${meta.courseCode}_${meta.branch}_${meta.sem}_${meta.year}_OPTICAMPUS.pdf`.toUpperCase();
      let finalBlob: Blob | File;

      if (files.length === 1 && files[0].type === "application/pdf") {
        finalBlob = files[0];
      } else {
        finalBlob = await convertImagesToPdf(files);
      }

      if (finalBlob.size > MAX_FILE_SIZE) throw new Error("File exceeds 10MB limit.");

      const { error: uploadError } = await supabase.storage.from('pdfs')
        .upload(standardizedName, finalBlob, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('pdfs').getPublicUrl(standardizedName);

      const { error: dbError } = await supabase.from('papers').insert([{
            title: standardizedName.replace('.pdf', ''),
            course_code: meta.courseCode,
            year: meta.year,
            sem: meta.sem,
            branch: meta.branch,
            exam_type: meta.examType,
            file_url: publicUrlData.publicUrl,
            uploaded_by: meta.uploadedBy,
            status: 'pending'
      }]);

      if (dbError) throw dbError;

      alert("Success! Paper uploaded for verification.");
      setFiles([]);
      setMeta({ ...meta, courseCode: "", examType: "", sem: "", branch: "" });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Header />
      
      {/* HEADER HERO SECTION */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <Link to="/previousyearpaper" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-xs font-bold uppercase tracking-wider mb-6 group">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Library
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Upload <span className="text-emerald-600 relative">
                           Material
                           <svg className="absolute w-full h-2 -bottom-1 left-0 text-emerald-200/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                           </svg>
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-3 font-medium text-base">Contribute to the sustainable digital archive for future students.</p>
                </div>
                <div className="px-5 py-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide flex items-center gap-2 shadow-sm">
                    <FileText size={16} /> Max Size: 10MB • PDF Format
                </div>
            </div>
          </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto px-4 mt-8 w-full">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <p className="text-red-700 text-sm font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT GRID */}
      <section className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* METADATA FORM (LEFT PANEL) */}
        <aside className="lg:col-span-5 order-2 lg:order-1 h-full">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wide border-b border-slate-100 pb-4">
                <Code size={20} className="text-emerald-500"/> Document Details
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Contributor Name</label>
                <div className="relative group/input">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors" />
                  <input type="text" value={meta.uploadedBy} onChange={(e) => setMeta({ ...meta, uploadedBy: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between ml-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Course Code</label>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${meta.courseCode.length === 6 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                        {meta.courseCode.length}/6
                    </span>
                </div>
                <div className="relative group/input">
                  <Code size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors" />
                  <input type="text" placeholder="e.g. CST101" maxLength={6} value={meta.courseCode} 
                    onChange={(e) => setMeta({ ...meta, courseCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 shadow-inner" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomDropdown label="Year" value={meta.year} options={yearOptions} onChange={(val) => setMeta({ ...meta, year: val })} />
                <CustomDropdown label="Semester" value={meta.sem} options={[1, 2, 3, 4, 5, 6, 7, 8]} onChange={(val) => setMeta({ ...meta, sem: val.toString() })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomDropdown label="Branch" value={meta.branch} options={["CSE", "ECE", "AIDE"]} onChange={(val) => setMeta({ ...meta, branch: val })} />
                <CustomDropdown label="Type" value={meta.examType} options={["Mid-Term", "End-Term"]} onChange={(val) => setMeta({ ...meta, examType: val })} />
              </div>
            </div>
          </div>
        </aside>

        {/* DRAG DROP ZONE (RIGHT PANEL) */}
        <main className="lg:col-span-7 order-1 lg:order-2 h-full">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex-1 flex flex-col justify-center">
              <div className="border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-2xl p-10 text-center relative group hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300 mb-6 min-h-[320px] flex flex-col items-center justify-center cursor-pointer">
                <input type="file" accept="application/pdf,image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} title="Upload Files" />
                
                {files.length > 0 ? (
                  <div className="animate-in zoom-in-95 duration-300">
                    <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 mb-4 shadow-sm border border-emerald-200">
                      {files[0].type === "application/pdf" ? <FileCheck size={40} /> : <ImageIcon size={40} />}
                    </div>
                    <p className="text-xl font-bold text-slate-800 mb-1">{files.length} File(s) Selected</p>
                    <p className="text-xs font-bold text-emerald-700 bg-emerald-100 inline-block px-3 py-1 rounded-full uppercase tracking-wide">
                      Total: {(files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-slate-400 mt-4 font-medium">Click to change selection</p>
                  </div>
                ) : (
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-slate-400 mb-6 shadow-sm border border-slate-100 group-hover:text-emerald-500 group-hover:border-emerald-200 transition-colors">
                      <CloudUpload size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2 group-hover:text-emerald-600 transition-colors">Drag & Drop Files</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">or click to browse device</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUpload} disabled={loading || files.length === 0}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 group active:scale-[0.98]"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18} /><span>Processing Upload...</span></>
              ) : (
                <>
                    <ShieldCheck size={18} className="group-hover:scale-110 transition-transform"/>
                    <span>Submit for Verification</span>
                </>
              )}
            </button>
          </div>
        </main>
      </section>
      <Footer />
    </article>
  );
}

interface CustomDropdownProps {
  label: string;
  value: string | number;
  options: (string | number)[];
  onChange: (val: string) => void;
  disabled?: boolean;
}

function CustomDropdown({ label, value, options, onChange, disabled }: CustomDropdownProps) {
  return (
    <div className={`transition-all duration-300 ${disabled ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block pl-1">
        {label}
      </label>
      <div className="relative group/select">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none appearance-none cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm"
        >
          <option value="">Select</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover/select:text-emerald-500 transition-colors pointer-events-none" />
      </div>
    </div>
  );
}