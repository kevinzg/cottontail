<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Editor from './Editor.svelte';
    import type { ICardData } from './types';

    const dispatch = createEventDispatcher();

    let editor: Editor;
    let title = '';
    let category = 'default';
    let sourceUrl = window.location.toString();
    let sourceName = window.document.title;

    const submit = () => {
        const content = editor.getContent();
        const card: ICardData = {
            title,
            content,
            category: category || 'default',
            source: {
                url: sourceUrl,
                name: sourceName,
            },
        };
        dispatch('save', card);
    };
</script>

<form on:submit|preventDefault={submit} class="space-y-1">
    <fieldset class="flex flex-col">
        <label class="text-sm font-medium text-gray-700" for="name">Title</label
        >
        <input
            id="name"
            name="name"
            required
            class="ml-2 border border-gray-300 py-1 px-1 text-sm text-gray-800 placeholder:text-sm placeholder:italic placeholder:text-gray-400"
            bind:value={title}
        />
    </fieldset>

    <fieldset>
        <label class="text-sm font-medium text-gray-700" for="content"
            >Content</label
        >
        <div class="ml-2">
            <Editor id="content" bind:this={editor} />
        </div>
    </fieldset>

    <fieldset class="flex flex-col">
        <label class="text-sm font-medium text-gray-700" for="category"
            >Category</label
        >
        <input
            id="category"
            name="category"
            placeholder="default"
            class="ml-2 border border-gray-300 py-1 px-1 text-sm text-gray-800 placeholder:text-sm placeholder:italic placeholder:text-gray-400"
            bind:value={category}
        />
    </fieldset>

    <fieldset class="flex flex-col">
        <label class="text-sm font-medium text-gray-700" for="sourceName"
            >Source</label
        >
        <div class="ml-2 flex flex-row space-x-1.5">
            <input
                id="sourceName"
                name="sourceName"
                placeholder="Name"
                class="grow border border-gray-300 py-1 px-1 text-sm text-gray-800 placeholder:text-sm placeholder:italic placeholder:text-gray-400"
                bind:value={sourceName}
            />
            <input
                id="sourceUrl"
                name="sourceUrl"
                placeholder="URL"
                class="border border-gray-300 py-1 px-1 text-sm text-gray-800 placeholder:text-sm placeholder:italic placeholder:text-gray-400"
                bind:value={sourceUrl}
            />
        </div>
    </fieldset>

    <div class="flex justify-around py-2">
        <button class="rounded bg-blue-300 p-1 px-4 text-gray-900">
            Submit
        </button>
    </div>
</form>
