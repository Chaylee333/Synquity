import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export interface RichTextEditorRef {
    focus: () => void;
    execCommand: (command: string, value?: string) => void;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
    ({ value, onChange, placeholder, className }, ref) => {
        const editorRef = useRef<HTMLDivElement>(null);
        const isUpdatingRef = useRef(false);

        useImperativeHandle(ref, () => ({
            focus: () => {
                editorRef.current?.focus();
            },
            execCommand: (command: string, value?: string) => {
                document.execCommand(command, false, value);
                editorRef.current?.focus();
                handleInput();
            },
        }));

        const handleInput = () => {
            if (editorRef.current && !isUpdatingRef.current) {
                const html = editorRef.current.innerHTML;
                onChange(html);
            }
        };

        const handlePaste = (e: React.ClipboardEvent) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        };

        useEffect(() => {
            if (editorRef.current && editorRef.current.innerHTML !== value) {
                isUpdatingRef.current = true;
                editorRef.current.innerHTML = value;
                isUpdatingRef.current = false;
            }
        }, [value]);

        return (
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onPaste={handlePaste}
                className={`${className} rich-text-editor`}
                data-placeholder={placeholder}
                suppressContentEditableWarning
                style={{
                    outline: 'none',
                }}
            >
                <style>{`
                    .rich-text-editor h1 { font-size: 1.5em; font-weight: bold; margin-top: 0.5em; margin-bottom: 0.25em; }
                    .rich-text-editor h2 { font-size: 1.25em; font-weight: bold; margin-top: 0.5em; margin-bottom: 0.25em; }
                    .rich-text-editor ul { list-style-type: disc; margin-left: 1.5em; }
                    .rich-text-editor ol { list-style-type: decimal; margin-left: 1.5em; }
                    .rich-text-editor li { margin-bottom: 0.25em; }
                    .rich-text-editor a { color: #2563eb; text-decoration: underline; cursor: pointer; }
                    .rich-text-editor blockquote { border-left: 4px solid #e5e7eb; padding-left: 1em; color: #4b5563; }
                    .rich-text-editor img { max-width: 100%; height: auto; border-radius: 0.375rem; margin: 0.5em 0; }
                `}</style>
            </div>
        );
    }
);

RichTextEditor.displayName = 'RichTextEditor';

// Helper function to convert HTML to Markdown
export function htmlToMarkdown(html: string): string {
    let markdown = html;

    // Remove div/p tags and replace with newlines
    markdown = markdown.replace(/<div>/gi, '\n');
    markdown = markdown.replace(/<\/div>/gi, '');
    markdown = markdown.replace(/<p>/gi, '');
    markdown = markdown.replace(/<\/p>/gi, '\n');
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

    // Headers
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');

    // Bold
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

    // Italic
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // Links
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Images
    markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
    markdown = markdown.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)');
    markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

    // Lists
    markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    });
    markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`);
    });

    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');

    // Clean up multiple newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.trim();

    return markdown;
}
