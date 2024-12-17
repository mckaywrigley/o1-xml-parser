"use client";
import { applyChangesAction } from "@/actions/apply-changes-actions";
import { useEffect, useState } from "react";

const STORAGE_KEY = "o1-xml-parser-minicache";

export function ApplyChangesForm() {
  const [xml, setXml] = useState<string>("");
  const [projectDirectory, setProjectDirectory] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY) || "";
  });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [preserveXml, setPreserveXml] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [successMessage]);

  const handleApply = async () => {
    setErrorMessage("");
    if (!xml.trim()) {
      setErrorMessage("Please paste XML before applying changes.");
      return;
    }
    try {
      const trimmedDirectory = projectDirectory.trim();
      await applyChangesAction(xml, trimmedDirectory);
      localStorage.setItem(STORAGE_KEY, trimmedDirectory);
      if (!preserveXml) {
        setXml("");
      }
      setSuccessMessage("Changes applied successfully");
    } catch (error: any) {
      setErrorMessage("An error occurred while applying changes.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="max-w-xl w-full flex flex-col gap-4">
        {errorMessage && <div className="text-red-400">{errorMessage}</div>}
        {successMessage && <div className="text-green-400">{successMessage}</div>}

        <div className="flex flex-col">
          <label className="mb-2 font-bold">Project Directory:</label>
          <input
            className="border bg-secondary text-secondary-foreground p-2 w-full rounded-md"
            type="text"
            value={projectDirectory}
            onChange={(e) => setProjectDirectory(e.target.value)}
            placeholder="e.g. /Users/myusername/projects/o1-xml-parser"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-bold">Paste XML here:</label>
          <textarea
            className="border bg-secondary text-secondary-foreground p-2 h-64 w-full rounded-md"
            value={xml}
            onChange={(e) => setXml(e.target.value)}
            placeholder="Paste the <code_changes>...</code_changes> XML here"
          />
        </div>

        <button
          className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors"
          onClick={handleApply}
        >
          Apply
        </button>

        <div className="flex items-center justify-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <input
            type="checkbox"
            id="preserve-xml"
            checked={preserveXml}
            onChange={(e) => setPreserveXml(e.target.checked)}
            className="h-3.5 w-3.5 cursor-pointer"
          />
          <label htmlFor="preserve-xml" className="text-sm cursor-pointer select-none">
            Preserve XML after applying
          </label>
        </div>
      </div>
    </div>
  );
}
