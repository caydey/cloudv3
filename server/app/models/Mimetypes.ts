import mime from "mime-types";

function getCustomType(filename: string): string | null {
  const extension = filename.split(".").pop() ?? "";

  const customLookup: Record<string, string> = {
    url: "application/x-mswinurl",
    cpp: "text/x-c++",
    cs: "text/x-csharp",
    kt: "text/x-kotlin",
    log: "text/x-log",
    py: "text/x-python",
    sh: "text/x-script",
    pptx: "x-office-presentation",
  };

  if (extension in customLookup) return customLookup[extension];
  return null;
}

export function getMimeType(filename?: string): string {
  if (!filename) return "unknown";

  const customFileType = getCustomType(filename);
  if (customFileType) return customFileType;

  const lookupFileType = mime.lookup(filename);
  if (lookupFileType) return lookupFileType;

  return "unknown";
}
