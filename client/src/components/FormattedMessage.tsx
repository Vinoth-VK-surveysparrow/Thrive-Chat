import React from 'react';

interface FormattedMessageProps {
  text: string;
  isUser: boolean;
}

export function FormattedMessage({ text, isUser }: FormattedMessageProps) {
  const formatText = (text: string) => {
    // Split text into lines
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          inCodeBlock = false;
          elements.push(
            <div
              key={`code-${index}`}
              className="bg-gray-100 dark:bg-gray-800 rounded p-2 my-2 font-mono text-sm overflow-x-auto"
            >
              <pre className="whitespace-pre-wrap">
                <code>{codeBlockContent.join('\n')}</code>
              </pre>
            </div>
          );
          codeBlockContent = [];
        } else {
          // Start of code block
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle numbered lists
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (numberedListMatch) {
        const [, number, content] = numberedListMatch;
        elements.push(
          <div key={index} className="my-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{number}. </span>
            <span>{formatInlineText(content)}</span>
          </div>
        );
        return;
      }

      // Handle bullet points and dashes
      const bulletMatch = line.match(/^[-•]\s+(.+)/);
      if (bulletMatch) {
        const [, content] = bulletMatch;
        elements.push(
          <div key={index} className="my-1 ml-2">
            <span className="text-gray-600 dark:text-gray-400 mr-2">•</span>
            <span>{formatInlineText(content)}</span>
          </div>
        );
        return;
      }

      // Handle headers (lines that end with :)
      if (line.trim().endsWith(':') && line.trim().length > 1) {
        elements.push(
          <div key={index} className="font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-1">
            {formatInlineText(line)}
          </div>
        );
        return;
      }

      // Handle empty lines
      if (line.trim() === '') {
        elements.push(<br key={index} />);
        return;
      }

      // Regular text
      elements.push(
        <div key={index} className="my-1">
          {formatInlineText(line)}
        </div>
      );
    });

    return elements;
  };

  const formatInlineText = (text: string) => {
    // Handle inline code with backticks
    const parts = text.split(/(`[^`]+`)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      
      // Handle bold text (basic **text** support)
      if (part.includes('**')) {
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((boldPart, boldIndex) => {
          if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
            return (
              <strong key={`${index}-${boldIndex}`} className="font-semibold">
                {boldPart.slice(2, -2)}
              </strong>
            );
          }
          return boldPart;
        });
      }
      
      return part;
    });
  };

  return (
    <div className={`text-sm ${isUser ? 'text-white' : 'text-gray-800 dark:text-gray-100'} leading-relaxed`}>
      {formatText(text)}
    </div>
  );
} 