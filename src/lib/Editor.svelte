<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Editor } from '@tiptap/core';
    import StarterKit from '@tiptap/starter-kit';
    import Image from '@tiptap/extension-image';

    let element: HTMLDivElement;
    let editor: Editor;

    onMount(() => {
        editor = new Editor({
            element: element,
            extensions: [StarterKit, Image],
            editorProps: {
                attributes: {
                    class: 'prose prose-sm m-2 focus:outline-none',
                },
            },
            content: '',
            onTransaction: () => {
                // force re-render so `editor.isActive` works as expected
                // editor = editor;
            },
        });
    });

    onDestroy(() => {
        if (editor) {
            editor.destroy();
        }
    });

    export function getContent() {
        return {
            text: editor.getText(),
            html: editor.getHTML(),
            json: editor.getJSON(),
        };
    }
</script>

<div class="border border-gray-300 bg-white" bind:this={element} />

<style>
    :global(.ProseMirror) {
        min-height: 8rem;
    }
</style>
