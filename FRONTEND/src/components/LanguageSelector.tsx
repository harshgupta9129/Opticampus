import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: any;
    google: any;
  }
}

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "ar", label: "Arabic" },
  { code: "ja", label: "Japanese" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "zh-TW", label: "Chinese (Traditional)" },
  { code: "ru", label: "Russian" },
  { code: "pt", label: "Portuguese" },
  { code: "it", label: "Italian" },
  { code: "nl", label: "Dutch" },
  { code: "ko", label: "Korean" },
  { code: "tr", label: "Turkish" },
  { code: "pl", label: "Polish" },
  { code: "sv", label: "Swedish" },
  { code: "fi", label: "Finnish" },
  { code: "da", label: "Danish" },
  { code: "no", label: "Norwegian" },
  { code: "cs", label: "Czech" },
  { code: "el", label: "Greek" },
  { code: "he", label: "Hebrew" },
  { code: "th", label: "Thai" },
  { code: "vi", label: "Vietnamese" },
  { code: "id", label: "Indonesian" },
  { code: "ms", label: "Malay" },
  { code: "uk", label: "Ukrainian" },
  { code: "ro", label: "Romanian" },
  { code: "hu", label: "Hungarian" },
  { code: "sk", label: "Slovak" },
  { code: "bg", label: "Bulgarian" },
  { code: "sr", label: "Serbian" },
  { code: "hr", label: "Croatian" },
  { code: "sl", label: "Slovenian" },
  { code: "et", label: "Estonian" },
  { code: "lv", label: "Latvian" },
  { code: "lt", label: "Lithuanian" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "gu", label: "Gujarati" },
  { code: "pa", label: "Punjabi" },
  { code: "ml", label: "Malayalam" },
  { code: "kn", label: "Kannada" },
  { code: "mr", label: "Marathi" },
  { code: "bn", label: "Bengali" },
  { code: "ur", label: "Urdu" }
];


export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("EN");

  useEffect(() => {
    // Initialize Google Translate silently
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          layout: 0
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // 🔥 REMOVE GOOGLE TOP BAR COMPLETELY
    const interval = setInterval(() => {
      const frame = document.querySelector(
        ".goog-te-banner-frame"
      ) as HTMLElement;

      if (frame) {
        frame.style.display = "none";
      }

      document.body.style.top = "0px";
      document.documentElement.style.top = "0px";
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const changeLanguage = (lang: any) => {
    document.cookie = `googtrans=/en/${lang.code}; path=/`;
    setSelected(lang.label.slice(0, 2).toUpperCase());
    window.location.reload();
  };

  return (
    <>
      {/* Hidden Google translator container */}
      <div id="google_translate_element" style={{ display: "none" }} />

      <div className="relative">
        {/* Language Button */}
        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-1.5 rounded-md bg-white/90 text-black text-sm hover:bg-white transition"
        >
          {selected} ▾
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-0 mt-2 w-52 max-h-60 overflow-y-auto
            bg-white rounded-lg shadow-xl border z-[9999]"
          >
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => changeLanguage(lang)}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {lang.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}



