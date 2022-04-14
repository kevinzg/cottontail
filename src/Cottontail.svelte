<script lang="ts">
    import Form from './lib/Form.svelte';
    import Window from './lib/Window.svelte';

    let hidden = false;

    export function open() {
        hidden = false;
    }

    function hide() {
        hidden = true;
    }
</script>

<Window on:close={hide} {hidden} x={20} y={50} w={480} h={540}>
    <Form on:close={hide} />
</Window>

{#if hidden}
    <div class="fixed bottom-5 left-5">
        <button
            class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200"
            on:click|preventDefault={open}
        >
            🐰
        </button>
    </div>
{/if}
