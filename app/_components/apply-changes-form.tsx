"use client";
import { applyChangesAction } from "@/actions/apply-changes-actions";
import { useEffect, useState } from "react";

export function ApplyChangesForm() {
  const [xml, setXml] = useState<string>("");
  const [projectDirectory, setProjectDirectory] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      await applyChangesAction(xml, projectDirectory.trim());
      setXml("");
      setSuccessMessage("Changes applied successfully");
    } catch (error: any) {
      setErrorMessage("An error occurred while applying changes.");
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-6 flex flex-col gap-6">
      {errorMessage && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="bg-primary/10 text-primary p-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label>Project Directory</label>
        <input
          className="w-full p-3"
          type="text"
          value={projectDirectory}
          onChange={(e) => setProjectDirectory(e.target.value)}
          placeholder="e.g. /Users/myusername/projects/o1-xml-parser"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Paste XML Here:</label>
        <textarea
          className="w-full p-3 h-[400px] font-mono text-sm"
          value={xml}
          onChange={(e) => setXml(e.target.value)}
          placeholder="Paste the <code_changes>...</code_changes> XML here"
        />
      </div>
      <button
        className="bg-primary text-primary-foreground py-3 px-4 rounded-lg w-full"
        onClick={handleApply}
      >
        Apply Changes
      </button>
    </div>
  );
}
