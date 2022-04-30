<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { ICardData } from './types';

    const dispatch = createEventDispatcher();

    let title = '';
    let category = 'default';
    let sourceUrl = window.location.toString();
    let sourceName = window.document.title;
    let content = '';

    const submit = () => {
        const card: ICardData = {
            title,
            content: { text: content, html: '', json: '{}' },
            category: category || 'default',
            source: {
                url: sourceUrl,
                name: sourceName,
            },
        };
        dispatch('save', card);
    };
</script>

<form
    on:submit|stopPropagation|preventDefault={submit}
    class="flex h-full flex-col space-y-1"
>
    <fieldset class="flex flex-col">
        <label class="text-sm font-medium text-gray-700" for="name">Title</label
        >
        <input
            id="name"
            name="name"
            required
            class="ml-2 border border-gray-300 py-1 px-1 text-sm text-gray-800"
            bind:value={title}
            on:keydown|stopPropagation
        />
    </fieldset>

    <fieldset class="flex grow flex-col">
        <label class="text-sm font-medium text-gray-700" for="content"
            >Content</label
        >
        <textarea
            id="content"
            name="content"
            class="ml-2 grow border border-gray-300 py-1 px-1 font-mono text-sm text-gray-800"
            rows="5"
            bind:value={content}
            on:keydown|stopPropagation
        />
    </fieldset>

    <fieldset class="flex flex-col">
        <label class="text-sm font-medium text-gray-700" for="category"
            >Category</label
        >
        <input
            id="category"
            name="category"
            placeholder="default"
            class="ml-2 border border-gray-300 py-1 px-1 text-sm text-gray-800"
            bind:value={category}
            on:keydown|stopPropagation
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
                class="grow border border-gray-300 py-1 px-1 text-sm text-gray-800"
                bind:value={sourceName}
                on:keydown|stopPropagation
            />
            <input
                id="sourceUrl"
                name="sourceUrl"
                placeholder="URL"
                class="border border-gray-300 py-1 px-1 text-sm text-gray-800"
                bind:value={sourceUrl}
                on:keydown|stopPropagation
            />
        </div>
    </fieldset>

    <div class="flex justify-around py-2">
        <button class="rounded bg-blue-300 p-1 px-4 text-gray-900">
            Submit
        </button>
    </div>
</form>
