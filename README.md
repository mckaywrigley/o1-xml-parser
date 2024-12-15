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
4. Run the xml parser
```bash
npm run dev
```

## The XML Prompt

You are an expert software engineer.

You are tasked with following my instructions.

Use the included project instructions as a general guide.

You will respond with 2 sections: A summary section and an XLM section.

Here are some notes on how you should respond in the summary section:

- Provide a brief overall summary
- Provide a 1-sentence summary for each file changed and why.
- Provide a 1-sentence summary for each file deleted and why.
- Format this section as markdown.

Here are some notes on how you should respond in the XML section:

- Respond with the XML and nothing else
- Include all of the changed files
- Specify each file operation with CREATE, UPDATE, or DELETE
- If it is a CREATE or UPDATE include the full file code. Do not get lazy.
- Each file should include a brief change summary.
- Include the full file path
- I am going to copy/paste that entire XML section into a parser to automatically apply the changes you made, so put the XML block inside a markdown codeblock.
- Make sure to enclose the code with ![CDATA[__CODE HERE__]]

Here is how you should structure the XML:

<code_changes>
<changed_files>
<file>
<file_summary>**BRIEF CHANGE SUMMARY HERE**</file_summary>
<file_operation>**FILE OPERATION HERE**</file_operation>
<file_path>**FILE PATH HERE**</file_path>
<file_code><![CDATA[
__FULL FILE CODE HERE__
]]></file_code>
</file>
**REMAINING FILES HERE**
</changed_files>
</code_changes>

So the XML section will be:

```xml
__XML HERE__
```

## About Me

I'm Mckay. I like to build AI tools.

Follow me here:

- [X](https://x.com/mckaywrigley)
- [YouTube](https://www.youtube.com/@realmckaywrigley)
- [GitHub](https://github.com/mckaywrigley)
- [Newsletter](https://mckaywrigley.substack.com/)
