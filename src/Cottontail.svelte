<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Form from './lib/Form.svelte';
    import type { IFlashcardData } from './lib/types';
    import Window from './lib/Window.svelte';

    const dispatch = createEventDispatcher();

    let hidden = false;
    export let path: 'form' | 'list' = 'form';

    // TODO: Get cards for this domain/URL
    let localCards: IFlashcardData[] = [];

    export function open() {
        hidden = false;
    }

    function hide() {
        hidden = true;
    }

    function save(ev: CustomEvent<IFlashcardData>) {
        const card = ev.detail;
        path = 'list';
        localCards.push(card);
        localCards = localCards;
        dispatch('save', card);
    }
</script>

<!-- NOTE: This container div is used to apply a CSS reset, see base.css -->
<div id="container">
    <Window on:close={hide} {hidden} x={20} y={50}>
        {#if path === 'form'}
            <Form
                on:close={hide}
                on:cancel={() => (path = 'list')}
                on:save={save}
            />
        {:else if path === 'list'}
            <div class="flex h-72 flex-col space-y-1 text-gray-800">
                <div class="mx-auto w-fit">
                    <button
                        class="mt-2 rounded border border-gray-400 bg-white py-1 px-2 text-sm font-semibold text-gray-800 shadow hover:bg-gray-100"
                        on:click={() => (path = 'form')}
                    >
                        New Card
                    </button>
                </div>
                <ul class="list-outside list-disc pl-4">
                    {#each localCards as card}
                        <!-- TODO: Click to edit card -->
                        <li class="max-w-lg">{card.front}</li>
                    {/each}
                </ul>
            </div>
        {/if}
    </Window>

    {#if hidden}
        <div class="fixed bottom-5 left-5 z-[9999]">
            <button
                class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-400 bg-white shadow hover:bg-gray-100"
                on:click|preventDefault={open}
            >
                🐰
            </button>
        </div>
    {/if}
</div>
