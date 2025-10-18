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
 * Render a TipTap-based rich text editor with a menu bar, editable content area, and a footer for action controls.
 *
 * Initializes editor content from `field.value` (parsed as JSON; falls back to empty content on missing/invalid JSON).
 * When the editor updates, calls `field.onChange` with the editor state serialized to a JSON string, if that callback exists.
 *
 * @param field - Object representing the form field. Expected shape includes `value` (a JSON string of editor content) and optional `onChange` callback that receives the editor state as a JSON string.
 * @param sendButton - Node rendered on the right side of the footer (typically an action or submit control).
 * @param footerLeft - Optional node rendered on the left side of the footer (e.g., status or helper content).
 * @returns The RichTextEditor React element.
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
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className='max-h-[200px] overflow-y-auto' />

            <div className='flex items-center justify-between gap-2 px-3 py-2 border-t border-input bg-card'>
                <div className='min-h-8 flex items-center'>{footerLeft}</div>
                <div className='shrink-0'>{sendButton}</div>
            </div>
        </div>
    )
}