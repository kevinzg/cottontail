<script lang="ts">
    import { liveQuery } from 'dexie';
    import type { Readable } from 'svelte/store';
    import { Database } from './lib/Database';
    import type { ICard } from './lib/types';

    const db = new Database();

    // @ts-ignore
    let cards = liveQuery<ICard[]>(() => db.cards.toArray()) as Readable<
        ICard[]
    >;
</script>

<h1 class="text-lg font-medium">Cottontail Dashboard</h1>
<hr />
<ul>
    {#if $cards}
        {#each $cards as card (card.id)}
            <li>{card.title}</li>
        {/each}
    {/if}
</ul>
