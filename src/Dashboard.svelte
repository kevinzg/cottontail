<script lang="ts">
    import { liveQuery } from 'dexie';
    import type { Readable } from 'svelte/store';
    import { Database } from './lib/Database';
    import type { ICard } from './lib/types';

    const db = new Database();
    (window as any).db = db;

    // @ts-ignore
    let cards = liveQuery<ICard[]>(() => db.cards.toArray()) as Readable<
        ICard[]
    >;
</script>

<h1 class="px-3 py-2 text-xl font-bold text-gray-800">Cottontail Dashboard</h1>
<hr />
<ul class="ml-4 mt-4 space-y-3 py-2 px-3">
    {#if $cards}
        {#each $cards as card (card.id)}
            <li>
                <details class="space-y-1">
                    <summary class="cursor-pointer">
                        <h4 class="inline text-lg font-medium text-gray-800">
                            {card.title}
                        </h4>
                        <span class="ml-1 text-sm font-medium text-gray-500">
                            {card.category}
                        </span>
                    </summary>
                    <div
                        class="mx-6 whitespace-pre-wrap border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800"
                    >
                        {card.content.text}
                    </div>

                    <div class="ml-6">
                        {#if card.source.url}
                            <div class="text-sm">
                                <span class="font-medium text-gray-700">
                                    Source:
                                </span>
                                <a
                                    target="_blank"
                                    class="text-gray-500 underline"
                                    href={card.source.url}
                                >
                                    {card.source.name}
                                </a>
                            </div>
                        {/if}
                        <div class="text-sm">
                            <span class="font-medium text-gray-700">Date:</span>
                            <span>{card.createdAt.toDateString()}</span>
                        </div>
                    </div>
                </details>
            </li>
        {/each}
    {/if}
</ul>
