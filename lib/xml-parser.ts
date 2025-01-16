import { DOMParser } from "@xmldom/xmldom";

interface ParsedFileChange {
  file_summary: string;
  file_operation: string;
  file_path: string;
  file_code?: string;
}

export async function parseXmlString(xmlString: string): Promise<ParsedFileChange[] | null> {
  try {
    // Sanitize input
    if (!xmlString || !xmlString.trim()) {
      throw new Error("Empty XML string provided");
    }

    // Remove any leading/trailing whitespace
    xmlString = xmlString.trim();

    // Debug log
    console.log("Processing XML:", xmlString.substring(0, 500) + "...");

    // Validate basic structure
    if (!xmlString.includes("<code_changes>") || !xmlString.includes("</code_changes>")) {
      throw new Error("XML must start with <code_changes> and end with </code_changes>");
    }

    if (!xmlString.includes("<changed_files>") || !xmlString.includes("</changed_files>")) {
      throw new Error("XML must contain <changed_files> element");
    }

    const parser = new DOMParser({
      locator: true,
      errorHandler: (level: string, msg: string) => {
        if (level === 'error' || level === 'fatal') {
          console.error("XML Parser Error:", msg);
        }
      }
    });

    const doc = parser.parseFromString(xmlString, "text/xml");

    // Validate document structure
    if (!doc || !doc.documentElement) {
      throw new Error("Failed to parse XML document");
    }

    if (doc.documentElement.nodeName !== "code_changes") {
      throw new Error("Root element must be <code_changes>");
    }

    const changedFilesNode = doc.getElementsByTagName("changed_files")[0];
    if (!changedFilesNode) {
      throw new Error("<changed_files> element is required");
    }

    // Get direct child nodes of changed_files
    const childNodes = changedFilesNode.childNodes;
    const changes: ParsedFileChange[] = [];
    let currentChange: Partial<ParsedFileChange> = {};

    // Process each node in sequence
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      if (node.nodeType === 1) { // ELEMENT_NODE
        const nodeName = node.nodeName;
        const nodeContent = node.textContent?.trim() ?? "";

        switch (nodeName) {
          case "file_summary":
            currentChange.file_summary = nodeContent;
            break;
          case "file_operation":
            currentChange.file_operation = nodeContent.toUpperCase();
            break;
          case "file_path":
            currentChange.file_path = nodeContent;
            break;
          case "file_code":
            // Look for CDATA section
            for (let j = 0; j < node.childNodes.length; j++) {
              const codeNode = node.childNodes[j];
              if (codeNode.nodeType === 4) { // CDATA_SECTION_NODE
                currentChange.file_code = codeNode.nodeValue?.trim();
                break;
              }
            }
            
            // If we have all required fields, add the change
            if (currentChange.file_summary && 
                currentChange.file_operation && 
                currentChange.file_path) {
              
              // Validate operation type
              if (!["CREATE", "UPDATE", "DELETE"].includes(currentChange.file_operation)) {
                console.error(`Invalid file_operation: ${currentChange.file_operation}. Must be CREATE, UPDATE, or DELETE`);
                currentChange = {};
                continue;
              }

              // Validate file_code presence for CREATE and UPDATE
              if (["CREATE", "UPDATE"].includes(currentChange.file_operation) && !currentChange.file_code) {
                console.error(`Missing file_code for ${currentChange.file_operation} operation on ${currentChange.file_path}`);
                currentChange = {};
                continue;
              }

              changes.push(currentChange as ParsedFileChange);
              currentChange = {};
            }
            break;
        }
      }
    }

    if (changes.length === 0) {
      console.error("XML Structure received:", doc.documentElement.toString());
      throw new Error("No valid file changes found in the XML. Make sure to follow the exact format:\n" +
        "<code_changes>\n" +
        "  <changed_files>\n" +
        "    <file_summary>BRIEF CHANGE SUMMARY HERE</file_summary>\n" +
        "    <file_operation>FILE OPERATION HERE</file_operation>\n" +
        "    <file_path>FILE PATH HERE</file_path>\n" +
        "    <file_code><![CDATA[CODE HERE]]></file_code>\n" +
        "    REMAINING FILES HERE\n" +
        "  </changed_files>\n" +
        "</code_changes>");
    }

    console.log(`Successfully parsed ${changes.length} file changes`);
    return changes;

  } catch (error: unknown) {
    console.error("Error parsing XML:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to parse XML: Unknown error");
  }
}