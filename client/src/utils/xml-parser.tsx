/**
 * XML Content Parser and Renderer for Blog Descriptions
 * Handles XML content from admin side and renders it safely on client side
 */

interface ParsedXMLContent {
  type: 'text' | 'html' | 'xml';
  content: string;
  isSafe: boolean;
}

/**
 * Safely parse XML content and determine if it's safe to render
 */
export function parseXMLContent(content: string): ParsedXMLContent {
  if (!content) {
    return { type: 'text', content: '', isSafe: true };
  }

  // Check if content contains XML-like structure
  const hasXMLTags = /<[^>]+>/.test(content);
  const hasHTMLTags = /<(?:div|p|span|h[1-6]|ul|ol|li|strong|em|b|i|a|img|br|hr)[^>]*>/i.test(content);
  
  if (hasXMLTags) {
    // Check for potentially dangerous tags
    const dangerousTags = /<(script|iframe|object|embed|form|input|textarea|select|button|style|link|meta)[^>]*>/gi;
    const hasDangerousTags = dangerousTags.test(content);
    
    if (hasDangerousTags) {
      // Strip dangerous tags and return safe content
      const safeContent = content.replace(dangerousTags, '');
      return { type: 'html', content: safeContent, isSafe: true };
    }
    
    return { type: 'html', content, isSafe: true };
  }
  
  // Regular text content
  return { type: 'text', content, isSafe: true };
}

/**
 * Render XML/HTML content safely
 */
export function renderXMLContent(content: string, className?: string): JSX.Element {
  const parsed = parseXMLContent(content);
  
  if (parsed.type === 'html') {
    return (
      <div 
        className={className || 'prose prose-slate max-w-none'}
        dangerouslySetInnerHTML={{ __html: parsed.content }}
      />
    );
  }
  
  return (
    <div className={className || 'text-gray-600 text-lg leading-relaxed'}>
      {parsed.content}
    </div>
  );
}

/**
 * Extract plain text from XML content for previews
 */
export function extractTextFromXML(content: string, maxLength: number = 150): string {
  if (!content) return '';
  
  // Remove HTML/XML tags
  const textContent = content.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  const decodedContent = textContent
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  // Truncate if needed
  if (decodedContent.length <= maxLength) {
    return decodedContent;
  }
  
  return decodedContent.substring(0, maxLength) + '...';
}

/**
 * Check if content contains rich formatting (XML/HTML)
 */
export function hasRichContent(content: string): boolean {
  if (!content) return false;
  return /<[^>]+>/.test(content);
}

/**
 * Sanitize XML content for safe rendering
 */
export function sanitizeXMLContent(content: string): string {
  if (!content) return '';
  
  // Remove script tags and their content
  let sanitized = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Remove other potentially dangerous tags
  const dangerousTags = [
    'iframe', 'object', 'embed', 'form', 'input', 'textarea', 
    'select', 'button', 'style', 'link', 'meta'
  ];
  
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>|<${tag}[^>]*/?>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  return sanitized;
} 