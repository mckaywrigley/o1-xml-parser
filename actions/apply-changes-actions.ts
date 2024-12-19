"use server";

import { promises as fs } from "fs";
import { applyFileChanges } from "@/lib/apply-changes";
import { parseXmlString } from "@/lib/xml-parser";
import path from "path";

interface ApplyChangesResult {
  succeededFiles: string[];
  failedFiles: { filePath: string; error: string }[];
}

export async function applyChangesAction(xml: string, projectDirectory: string): Promise<ApplyChangesResult> {
  console.log("Received XML:", xml.substring(0, 200) + "...");
  
  const succeededFiles: string[] = [];
  const failedFiles: { filePath: string; error: string }[] = [];
  
  try {
    const changes = await parseXmlString(xml);
    console.log("Parsed changes:", JSON.stringify(changes, null, 2));

    if (!changes || !Array.isArray(changes)) {
      throw new Error("Invalid XML format. Expected <changed_files> with one or more <file> elements.");
    }

    let finalDirectory = projectDirectory && projectDirectory.trim() !== "" 
      ? projectDirectory.trim() 
      : process.env.PROJECT_DIRECTORY;

    if (!finalDirectory) {
      throw new Error("No project directory provided. Please enter a directory path or set PROJECT_DIRECTORY in .env.local");
    }

    // Normalize path
    finalDirectory = path.resolve(finalDirectory);
    console.log("Target directory:", finalDirectory);

    // Validate directory exists
    try {
      await fs.access(finalDirectory);
    } catch (error) {
      throw new Error(`Cannot access directory: ${finalDirectory}. Please make sure it exists and you have permissions.`);
    }

    // Validate XML structure
    for (const file of changes) {
      if (!file.file_path) {
        throw new Error("Missing file_path in XML");
      }
      if (!file.file_operation) {
        throw new Error(`Missing file_operation for file: ${file.file_path}`);
      }
      if (["CREATE", "UPDATE"].includes(file.file_operation.toUpperCase()) && !file.file_code) {
        throw new Error(`Missing file_code for ${file.file_operation} operation on ${file.file_path}`);
      }
    }

    // Apply changes with better error handling
    for (const file of changes) {
      try {
        console.log(`Processing file: ${file.file_path} (${file.file_operation})`);
        await applyFileChanges(file, finalDirectory);
        console.log(`Successfully processed: ${file.file_path}`);
        succeededFiles.push(file.file_path);
      } catch (error: unknown) {
        console.error(`Error processing file ${file.file_path}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        failedFiles.push({ filePath: file.file_path, error: errorMessage });
      }
    }

    console.log("File changes processing complete.");
  } catch (error: unknown) {
    console.error('Error in applyChangesAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    // If an overarching error occurs before processing files, return that as a single failure
    failedFiles.push({ filePath: 'N/A', error: errorMessage });
  }

  return { succeededFiles, failedFiles };
}