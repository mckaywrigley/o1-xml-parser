# o1 XML Parser

A simple parse-and-apply tool that parses XML responses from o1 in ChatGPT and applies them to a target codebase.

## Tutorial

View a tutorial [here](https://x.com/mckaywrigley/status/1865825221560893798).

## Quick Start

1. Clone the repo.

```bash
git clone https://github.com/mckaywrigley/o1-xml-parser
```

2. Install dependencies.

```bash
npm install
```

3. (Optional) Create a `.env.local` file and set the `PROJECT_DIRECTORY` environment variable to your project directory.

```bash
cp .env.example .env.local
```

```bash
PROJECT_DIRECTORY=/path/to/your/project # Ex: /Users/you/your-project
```

## The XML Prompt

You are an expert software engineer.

You are tasked with following my instructions.

Use the included project instructions as a general guide.

You will respond with **2 sections**: a **summary section** and an **XML section**.

---

### Notes for the Summary Section
- Provide a **brief overall summary**.
- Provide a **1-sentence summary for each changed file** and explain why it was changed.
- Provide a **1-sentence summary for each deleted file** and explain why it was deleted.
- Format this section as **Markdown**.

---

### Notes for the XML Section
- **XML Section** (as an XML code block).

#### Important:
Only return the XML, nothing else, inside this code block.

#### Follow this format:
- Include all **changed**, **created**, or **deleted** files.
- For each file, create a `<file>` element containing:
    - `<file_summary>`: A brief summary of the change.
    - `<file_operation>`: `CREATE`, `UPDATE`, or `DELETE`.
    - `<file_path>`: The full path to the file.
    - `<file_code>`: For `CREATE` and `UPDATE`, include the **complete file code** without omissions.  
      For `DELETE`, `<file_code>` is **not necessary**.
- Each file should be in its own `<file>` element.
- Enclose everything in a `<code_changes>` block with a nested `<changed_files>` block.
- Use a `<![CDATA[ ... ]]>` block for the code inside `<file_code>` to avoid breaking the XML with special characters.

---

### Structure Example:

```xml
<code_changes>
  <changed_files>
    <file>
      <file_summary>BRIEF CHANGE SUMMARY HERE</file_summary>
      <file_operation>CREATE|UPDATE|DELETE</file_operation>
      <file_path>/full/path/to/file</file_path>
      <file_code><![CDATA[
__FULL FILE CODE HERE__
]]></file_code>
    </file>
    <!-- Additional <file> blocks for other files -->
  </changed_files>
</code_changes>
```

## About Me

I'm Mckay. I like to build AI tools.

Follow me here:

- [X](https://x.com/mckaywrigley)
- [YouTube](https://www.youtube.com/@realmckaywrigley)
- [GitHub](https://github.com/mckaywrigley)
- [Newsletter](https://mckaywrigley.substack.com/)
