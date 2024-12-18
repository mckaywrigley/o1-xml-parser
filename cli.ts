#!/usr/bin/env node

import { promises as fs } from "fs";
import { parseXmlString } from "./lib/xml-parser";
import { applyFileChanges } from "./lib/apply-changes";
import { join } from "path";

async function main() {
  try {
    // Get arguments
    const xmlPath = process.argv[2];
    const projectDir = process.argv[3];

    if (!xmlPath || !projectDir) {
      console.error("Usage: o1-xml-parser <xml-file-path> <project-directory>");
      process.exit(1);
    }

    // Read XML file
    const xmlContent = await fs.readFile(xmlPath, "utf-8");

    // Parse XML
    const changes = await parseXmlString(xmlContent);
    if (!changes) {
      console.error("Failed to parse XML or no changes found");
      process.exit(1);
    }

    // Apply changes
    for (const change of changes) {
      console.log(`Applying ${change.file_operation} to ${change.file_path}...`);
      await applyFileChanges(change, projectDir);
    }

    console.log("All changes applied successfully!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();