"use client";

import { EditorContent, useEditor } from '@tiptap/react'
import { editorExtensions } from './extensions';
import { MenuBar } from './MenuBar';

interface RichTextEditorProps {
    field: any;
    sendButton: React.ReactNode;
    footerLeft?: React.ReactNode;
}

/**
 * Render a TipTap-based rich text editor wired to a field-like value/onChange interface.
 *
 * The editor initializes from `field.value` (parsed as JSON when present) and calls `field.onChange`
 * with the editor document serialized as a JSON string whenever the content updates.
 *
 * @param field - Object containing `value` (stringified editor JSON) and an optional `onChange` callback invoked with the new stringified editor JSON
 * @param sendButton - UI element rendered on the right side of the footer (typically a send/submit control)
 * @param footerLeft - Optional UI element rendered on the left side of the footer
 * @returns The React element tree for the rich text editor with toolbar, editable area, and footer
 */
export function RichTextEditor({ field, sendButton, footerLeft }: Readonly<RichTextEditorProps>) {
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