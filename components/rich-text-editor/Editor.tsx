"use client";

import { EditorContent, useEditor } from '@tiptap/react'
import { editorExtensions } from './extensions';
import { MenuBar } from './MenuBar';

interface iAppProps {
    field: any;
    sendButton: React.ReactNode;
    footerLeft?: React.ReactNode;
}

/**
 * Renders a rich-text editor with a formatting toolbar and configurable footer.
 *
 * The editor initializes its content by parsing `field.value` as JSON and falls back to an empty document on missing or invalid JSON. When the editor content changes, `field.onChange` (if provided) is called with the editor document serialized as a JSON string.
 *
 * @param field - Controlled field object containing `value` (string) and optional `onChange` callback invoked with the serialized editor content
 * @param sendButton - Element rendered on the right side of the footer (typically an action button)
 * @param footerLeft - Optional element rendered on the left side of the footer
 * @returns The rendered rich-text editor React element
 */
export function RichTextEditor({ field, sendButton, footerLeft }: iAppProps) {
    const editor = useEditor({
        immediatelyRender: false,
        content: (() => {
            if (!field?.value) return "";

            try {
                return JSON.parse(field.value);
            } catch {
                return "";
            }
        })(),
        onUpdate: ({ editor }) => {
            if (field?.onChange) {
                field.onChange(JSON.stringify(editor.getJSON()));
            }
        },
        extensions: editorExtensions,
        editorProps: {
            attributes: {
                class: 'max-w-none min-h-[125px] focus:outline-none p-4 prose dark:prose-invert marker:text-primary',
            }
        }
    });

    return (
        <div className='relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col'>
            <MenuBar editor={editor}/>
            <EditorContent editor={editor} className='max-h-[200px] overflow-y-auto' />

            <div className='flex items-center justify-between gap-2 px-3 py-2 border-t border-input bg-card'>
                <div className='min-h-8 flex items-center'>{footerLeft}</div>
                <div className='shrink-0'>{sendButton}</div>
            </div>
        </div>
    )
}