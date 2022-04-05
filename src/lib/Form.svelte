<script lang="ts">
    import Editor from './Editor.svelte';

    let front: Editor;
    let back: Editor;

    const submit = (ev: SubmitEvent) => {
        const form: HTMLFormElement = ev.target as any;
        const data = new FormData(form);
        console.log(front.getContent());
        console.log(back.getContent());
        console.log(Object.fromEntries([...data.entries()]));
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
