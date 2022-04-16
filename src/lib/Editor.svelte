<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Editor } from '@tiptap/core';
    import StarterKit from '@tiptap/starter-kit';
    import Image from '@tiptap/extension-image';

    export let id: string;

    let element: HTMLDivElement;
    let editor: Editor;

    onMount(() => {
        editor = new Editor({
            element: element,
            extensions: [StarterKit, Image],
            editorProps: {
                attributes: {
                    class: 'h-full prose prose-sm m-2 focus:outline-none',
                },
            },
            content: '',
            injectCSS: false,
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
            json: JSON.stringify(editor.getJSON()),
        };
    }
</script>

<div {id} class="h-full border border-gray-300 bg-white" bind:this={element} />
