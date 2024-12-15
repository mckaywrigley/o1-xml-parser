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
    <div className="max-w-xl w-full mx-auto p-4 flex flex-col gap-4">
      {errorMessage && <div className="text-red-400">{errorMessage}</div>}
      {successMessage && <div className="text-green-400">{successMessage}</div>}
      <div className="flex flex-col">
        <label className="mb-2 font-bold">Project Directory:</label>
        <input
          className="border bg-secondary text-secondary-foreground p-2 w-full rounded-md"
          type="text"
          value={projectDirectory}
          onChange={(e) => setProjectDirectory(e.target.value)}
          placeholder={projectDirectory.trim() !== "" ? projectDirectory.trim() : process.env.PROJECT_DIRECTORY}
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
    </div>
  );
}
