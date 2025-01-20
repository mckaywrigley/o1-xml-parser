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

4. Build and Run
```bash
npm run build
```

```bash
npm start
``` 

## The XML Prompt (updated 1/12/25)

Present a complete plan to solve the problem and implement it in the codebase.

At the end of your response, respond with the following XML section (if applicable).

XML Section:
   - Do not get lazy. Always output the full code in the XML section.
   - Enclose this entire section in a markdown codeblock
   - Include all of the changed files
   - Specify each file operation with CREATE, UPDATE, or DELETE
   - For CREATE or UPDATE operations, include the full file code
   - Include the full file path (relative to the project directory, good: app/page.tsx, bad: /Users/mckaywrigley/Desktop/projects/new-chat-template/app/page.tsx)
   - Enclose the code with ![CDATA[__CODE HERE__]]
   - Use the following XML structure:

```xml
<code_changes>
  <changed_files>
    <file>
      <file_operation>__FILE OPERATION HERE__</file_operation>
      <file_path>__FILE PATH HERE__</file_path>
      <file_code><![CDATA[
__FULL FILE CODE HERE__
]]></file_code>
    </file>
    __REMAINING FILES HERE__
  </changed_files>
</code_changes>
```

Other rules:
- DO NOT remove <ai_context> sections. These are to provide you additional context about each file.
- If you create a file, add an <ai_context> comment section at the top of the file.
- If you update a file make sure its <ai_context> stays up-to-date
- DO NOT add comments related to your edits
- DO NOT remove my existing comments

We may go back and forth a few times. If we do, remember to continue to output the entirety of the code in an XML section (if applicable).

Take all the time you need.

## About Me

I'm Mckay. I like to build AI tools.

Follow me here:

- [X](https://x.com/mckaywrigley)
- [YouTube](https://www.youtube.com/@realmckaywrigley)
- [GitHub](https://github.com/mckaywrigley)
- [Newsletter](https://mckaywrigley.substack.com/)
