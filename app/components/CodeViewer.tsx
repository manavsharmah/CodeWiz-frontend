import React from "react";

interface CodeViewerProps {
  code: string[]; // Array of pseudocode lines
  highlightedLine: number | null; // Current line to highlight
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  highlightedLine,
}) => {
  return (
    <div className="code-viewer-container bg-gray-700 rounded-lg p-4 shadow-lg">
      <div className="code-header bg-gray-800 text-white p-2 rounded-t-lg text-center text-lg font-semibold">
        Pseudocode
      </div>
      <div className="code-lines overflow-y-auto max-h-[350px]">
        {code.map((line, index) => (
          <pre
            key={index}
            className={`code-line text-sm px-2 py-1 rounded ${
              index === highlightedLine
                ? "bg-yellow-500/20 text-yellow-300 font-semibold"
                : "text-gray-300"
            }`}
          >
            {line}
          </pre>
        ))}
      </div>
    </div>
  );
};
