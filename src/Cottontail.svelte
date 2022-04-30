<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Form from './lib/Form.svelte';
    import type { ICardData } from './lib/types';
    import Window from './lib/Window.svelte';

    const dispatch = createEventDispatcher();

    let hidden = false;
    export let path: 'form' | 'list' = 'form';

    let cards: ICardData[] = [];

    export function open() {
        hidden = false;
    }

    function hide() {
        hidden = true;
    }

    function save(ev: CustomEvent) {
        path = 'list';
        cards.push(ev.detail);
        cards = cards;
        dispatch('save', ev.detail);
    }
</script>

<!-- NOTE: This container div is used to apply a CSS reset, see base.css -->
<div id="container">
    <Window on:close={hide} {hidden} x={20} y={50}>
        {#if path === 'form'}
            <Form on:close={hide} on:save={save} />
        {:else if path === 'list'}
            <ul>
                {#each cards as card}
                    <li>{card.title}</li>
                {/each}
            </ul>
            <button
                class="bg-blue-300 rounded"
                on:click={() => (path = 'form')}
            >
                New card
            </button>
        {/if}
    </Window>

    {#if hidden}
        <div class="fixed bottom-5 left-5 z-[9999]">
            <button
                class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200"
                on:click|preventDefault={open}
            >
                🐰
            </button>
        </div>
    {/if}
</div>
