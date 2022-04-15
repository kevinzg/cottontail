<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Editor from './Editor.svelte';
    import type { ICardData } from './types';

    const dispatch = createEventDispatcher();

    let editor: Editor;
    let title = '';

    const submit = () => {
        const content = editor.getContent();
        const card: ICardData = {
            title,
            content,
            category: 'default',
            source: {
                url: window.location.toString(),
                name: window.document.title,
            },
        };
        dispatch('save', card);
    };
</script>

<form on:submit|preventDefault={submit} class="space-y-1">
    <fieldset>
        <label class="font-medium text-gray-700" for="front">Front</label>
        <Editor bind:this={front} />
    </fieldset>

    <fieldset>
        <label class="font-medium text-gray-700" for="back">Back</label>
        <Editor bind:this={back} />
    </fieldset>

    <fieldset class="flex flex-col">
        <label class="font-medium text-gray-700" for="name">Card name</label>
        <input
            id="name"
            name="name"
            placeholder="(optional)"
            class="card-name py-1 px-1 text-sm text-gray-800 placeholder:text-sm placeholder:italic placeholder:text-gray-400"
            bind:value={title}
        />
    </fieldset>

    <div class="flex justify-around py-2">
        <button
            on:click|preventDefault={() => {}}
            class="rounded bg-red-300 p-1 px-4 text-gray-800"
        >
            Close
        </button>
        <button class="rounded bg-blue-300 p-1 px-4 text-gray-800">
            Submit
        </button>
    </div>
</form>

<style>
    .card-name {
        border: 1px solid #ccc;
    }
</style>
