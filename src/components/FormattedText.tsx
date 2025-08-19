/**
 * FormattedText Component
 * 
 * A utility component that formats chat messages with improved readability:
 * - Converts URLs to clickable hyperlinks
 * - Preserves line breaks and paragraphs
 * - Handles bullet points and numbered lists
 * - Formats code blocks with monospace font
 * - Maintains proper spacing and typography
 * 
 * @component
 */

import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className = '' }: FormattedTextProps) {
  // URL regex pattern to match http(s) URLs
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
  
  // Email regex pattern
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
  
  // Function to clean trailing punctuation from URLs
  const cleanUrl = (url: string): string => {
    // Remove common trailing punctuation that shouldn't be part of URLs
    return url.replace(/[.,;:!?\])}>]+$/, '');
  };
  
  // Split text into paragraphs
  const paragraphs = text.split(/\n\s*\n/);
  
  const formatTextSegment = (segment: string, key: string) => {
    // Handle code blocks (text between backticks)
    const codeBlockRegex = /```[\s\S]*?```|`[^`]+`/g;
    const parts = segment.split(codeBlockRegex);
    const codeBlocks = segment.match(codeBlockRegex) || [];
    
    let result: React.ReactNode[] = [];
    
    parts.forEach((part, index) => {
      if (index > 0) {
        const codeBlock = codeBlocks[index - 1];
        if (codeBlock.startsWith('```')) {
          // Multi-line code block
          const code = codeBlock.slice(3, -3).trim();
          result.push(
            <pre 
              key={`${key}-code-${index}`} 
              className="bg-gray-800 border border-gray-600 rounded-lg p-3 my-2 text-sm font-mono overflow-x-auto"
            >
              <code className="text-gray-100">{code}</code>
            </pre>
          );
        } else {
          // Inline code
          const code = codeBlock.slice(1, -1);
          result.push(
            <code 
              key={`${key}-inline-${index}`} 
              className="bg-gray-700 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono"
            >
              {code}
            </code>
          );
        }
      }
      
      if (part) {
        result.push(...formatLinks(part, `${key}-${index}`));
      }
    });
    
    return result;
  };
  
  const formatLinks = (text: string, key: string) => {
    // First handle custom pattern: "quoted text" (URL)
    const customLinkRegex = /"([^"]+)"\s*\((https?:\/\/[^\s<>"{}|\\^`[\]]+)\)/gi;
    
    // Process custom links first and replace them with placeholders
    const customLinkMatches: { match: RegExpExecArray; replacement: string }[] = [];
    let customMatch;
    let customIndex = 0;
    
    // Reset regex to start from beginning
    customLinkRegex.lastIndex = 0;
    
    let processedText = text;
    while ((customMatch = customLinkRegex.exec(text)) !== null) {
      const placeholder = `__CUSTOM_LINK_${customIndex}__`;
      customLinkMatches.push({ match: customMatch, replacement: placeholder });
      processedText = processedText.replace(customMatch[0], placeholder);
      customIndex++;
    }

    // Now handle regular URLs on the processed text
    let result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let urlIndex = 0;

    // Reset regex to start from beginning
    urlRegex.lastIndex = 0;
    
    while ((match = urlRegex.exec(processedText)) !== null) {
      const beforeUrl = processedText.substring(lastIndex, match.index);
      const rawUrl = match[0];
      const cleanedUrl = cleanUrl(rawUrl);
      const urlLength = cleanedUrl.length;
      
      // Add text before URL (handle emails and custom link placeholders in this text)
      if (beforeUrl) {
        result.push(...processTextWithPlaceholders(beforeUrl, customLinkMatches, `${key}-before-${urlIndex}`));
      }
      
      // Add the URL as a link (replacing only the cleaned URL portion)
      result.push(
        <a 
          key={`${key}-url-${urlIndex}`}
          href={cleanedUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors duration-200"
        >
          {cleanedUrl}
        </a>
      );
      
      // Add any trailing punctuation that was removed from the URL
      const trailingPunctuation = rawUrl.substring(urlLength);
      if (trailingPunctuation) {
        result.push(trailingPunctuation);
      }
      
      lastIndex = match.index + match[0].length;
      urlIndex++;
    }
    
    // Handle remaining text after last URL
    const remainingText = processedText.substring(lastIndex);
    if (remainingText) {
      result.push(...processTextWithPlaceholders(remainingText, customLinkMatches, `${key}-after`));
    }
    
    return result;
  };

  const processTextWithPlaceholders = (text: string, customLinkMatches: { match: RegExpExecArray; replacement: string }[], key: string) => {
    let processedText = text;
    
    // Replace placeholders with actual custom links one by one
    for (const linkData of customLinkMatches) {
      if (processedText.includes(linkData.replacement)) {
        const [, linkText, url] = linkData.match;
        const parts = processedText.split(linkData.replacement);
        
        if (parts.length > 1) {
          // Found the placeholder, build result with custom link
          let result: React.ReactNode[] = [];
          
          parts.forEach((part, partIndex) => {
            if (partIndex > 0) {
              // Add the custom link between parts
              result.push(
                <a 
                  key={`${key}-custom-${linkData.replacement}`}
                  href={cleanUrl(url)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors duration-200"
                >
                  {linkText}
                </a>
              );
            }
            if (part) {
              result.push(...formatEmails(part, `${key}-part-${partIndex}`));
            }
          });
          
          return result;
        }
      }
    }
    
    // If no placeholders were found, just format emails
    return formatEmails(processedText, key);
  };

  const formatEmails = (text: string, key: string) => {
    let result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let emailIndex = 0;

    // Reset regex to start from beginning
    emailRegex.lastIndex = 0;
    
    while ((match = emailRegex.exec(text)) !== null) {
      const beforeEmail = text.substring(lastIndex, match.index);
      const email = match[0];
      
      // Add text before email
      if (beforeEmail) {
        result.push(beforeEmail);
      }
      
      // Add the email as a link (replacing the original email text)
      result.push(
        <a 
          key={`${key}-email-${emailIndex}`}
          href={`mailto:${email}`}
          className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors duration-200"
        >
          {email}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
      emailIndex++;
    }
    
    // Handle remaining text after last email
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      result.push(remainingText);
    }
    
    return result;
  };
  
  const formatParagraph = (paragraph: string, index: number) => {
    const lines = paragraph.split('\n');
    
    // Check if this is a list
    const isList = lines.some(line => 
      /^\s*[-*•]\s/.test(line) || /^\s*\d+\.\s/.test(line)
    );
    
    if (isList) {
      return (
        <div key={`para-${index}`} className="space-y-1">
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;
            
            // Bullet point
            if (/^\s*[-*•]\s/.test(line)) {
              const content = line.replace(/^\s*[-*•]\s/, '');
              return (
                <div key={`${index}-${lineIndex}`} className="flex items-start space-x-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span className="flex-1">{formatTextSegment(content, `${index}-${lineIndex}`)}</span>
                </div>
              );
            }
            
            // Numbered list
            if (/^\s*\d+\.\s/.test(line)) {
              const match = line.match(/^\s*(\d+)\.\s(.*)$/);
              if (match) {
                const [, number, content] = match;
                return (
                  <div key={`${index}-${lineIndex}`} className="flex items-start space-x-2">
                    <span className="text-purple-400 mt-0.5 font-medium">{number}.</span>
                    <span className="flex-1">{formatTextSegment(content, `${index}-${lineIndex}`)}</span>
                  </div>
                );
              }
            }
            
            // Regular line
            return (
              <div key={`${index}-${lineIndex}`}>
                {formatTextSegment(trimmedLine, `${index}-${lineIndex}`)}
              </div>
            );
          })}
        </div>
      );
    }
    
    // Regular paragraph - handle line breaks
    const formattedLines = lines.map((line, lineIndex) => {
      if (!line.trim()) return null;
      return (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {lineIndex > 0 && <br />}
          {formatTextSegment(line, `${index}-${lineIndex}`)}
        </React.Fragment>
      );
    }).filter(Boolean);
    
    return (
      <p key={`para-${index}`} className="leading-relaxed">
        {formattedLines}
      </p>
    );
  };
  
  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((paragraph, index) => {
        if (!paragraph.trim()) return null;
        return formatParagraph(paragraph, index);
      })}
    </div>
  );
}

export default FormattedText;