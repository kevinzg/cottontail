<script lang="ts">
    import type { IFlashcard } from './lib/types';
    import * as service from './lib/service';

    function needsSync(c: IFlashcard) {
        return !c.ankiVersion || c.updatedAt > c.ankiVersion;
    }

    let cards = service.allCardsStore();

    let pendingSyncCards: number;
    $: {
        if ($cards) {
            pendingSyncCards = $cards.filter((c) => needsSync(c)).length;
        }
    }

    function downloadTextFile(
        text: string,
        filename: string,
        mimeType: string
    ) {
        const blob = new Blob([text], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const anchor = window.document.createElement('a');
        anchor.href = url;
        anchor.download = filename;

        window.document.body.appendChild(anchor);
        anchor.click();
        window.document.body.removeChild(anchor);

        URL.revokeObjectURL(url);
    }

    function getFilename(): string {
        const date = new Date()
            .toISOString()
            .replace(/\.\d{3}Z$/, '')
            .replaceAll(/[T]/g, '-')
            .replaceAll(/[:]/g, '.');
        return `cottontail-${date}`;
    }

    function exportCSV() {
        type CSVFields =
            | Exclude<keyof IFlashcard, 'source' | 'id'>
            | 'sourceURL'
            | 'sourceName';
        const fields: Array<CSVFields> = [
            'uuid',
            'kind',
            'front',
            'back',
            'deck',
            'sourceURL',
            'sourceName',
            'createdAt',
            'updatedAt',
            'ankiId',
        ];
        const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
        const maybeEscape = (value: string) =>
            value.includes('"') ? escape(value) : value;
        const format: Record<CSVFields, (card: IFlashcard) => string> = {
            uuid: (card) => card.uuid,
            kind: (card) => card.kind,
            front: (card) => escape(card.front),
            back: (card) => escape(card.back),
            deck: (card) => maybeEscape(card.deck),
            sourceURL: (card) => escape(card.source.url),
            sourceName: (card) => escape(card.source.title),
            createdAt: (card) => card.createdAt.toISOString(),
            updatedAt: (card) => card.updatedAt.toISOString(),
            ankiId: (card) => `${card.ankiId ?? ''}`,
            ankiVersion: (card) => `${card.ankiVersion?.toISOString() ?? ''}`,
        };
        const header = fields.join(',');
        const rows = $cards
            .map((card) => fields.map((f) => format[f](card)).join(','))
            .join('\n');
        const data = header + '\n' + rows + '\n';
        downloadTextFile(data, `${getFilename()}.csv`, 'text/csv');
    }

    function exportJSON() {
        const data = JSON.stringify($cards, null, 4);
        downloadTextFile(data, `${getFilename()}.json`, 'application/json');
    }

    function deleteCard(card: IFlashcard) {
        const confirmed = window.confirm(
            `Are you sure you want to delete card: ${card.front}?`
        );
        if (!confirmed) return;
        service.deleteCard(card).catch(console.error);
    }

    function syncCard(card: IFlashcard) {
        service.syncToAnki(card).catch(console.error);
    }

    async function syncAll() {
        const pending = $cards.filter((c) => needsSync(c));
        try {
            // TODO: Do some of these concurrently
            for (const card of pending) {
                await service.syncToAnki(card);
            }
        } catch (err) {
            console.error(err);
        }
    }
</script>

<div class="flex flex-row px-3">
    <h1 class="flex-grow justify-center py-2 text-xl font-bold text-gray-800">
        Cottontail Dashboard
    </h1>
    <button on:click={exportCSV} class="btn justify-center">
        Export as CSV
    </button>
    <button on:click={exportJSON} class="btn justify-center">
        Export as JSON
    </button>
</div>

<hr />

<!-- TODO: Display sync progress/errors -->
<div class="ml-4 mt-2">
    {pendingSyncCards} card(s) need(s) to be synced.
    <button on:click={syncAll} class="underline">Sync now</button>
</div>

<!-- TODO: Pagination -->
<ul class="ml-4 mt-2 space-y-3 py-2 px-3">
    {#if $cards}
        {#each $cards as card (card.uuid)}
            {@const synced = !needsSync(card)}
            <li>
                <details class="space-y-1">
                    <summary class="cursor-pointer">
                        <h4 class="inline text-lg font-medium text-gray-800">
                            {card.front}
                        </h4>
                        <span class="ml-1 text-sm font-medium text-gray-500">
                            {card.deck}
                        </span>
                    </summary>
                    <div
                        class="mx-6 whitespace-pre-wrap border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800"
                    >
                        {card.back}
                    </div>

                    <div class="ml-6 text-sm">
                        {#if card.source.url}
                            <div>
                                <span class="font-medium text-gray-700">
                                    Source:
                                </span>
                                <a
                                    rel="noreferrer"
                                    target="_blank"
                                    class="text-gray-500 underline"
                                    href={card.source.url}
                                >
                                    {card.source.title}
                                </a>
                            </div>
                        {/if}
                        <div>
                            <span class="font-medium text-gray-700">
                                Created:
                            </span>
                            <span>
                                {card.createdAt.toDateString()}
                                {card.createdAt.toLocaleTimeString()}
                            </span>
                        </div>
                        <!-- TODO: Don't create an event listener for each card -->
                        <div class="space-x-2">
                            <span>
                                {#if synced}
                                    ✅ Synced
                                {:else}
                                    ❌ Not synced
                                {/if}
                            </span>
                            <span>
                                <button
                                    on:click={() => syncCard(card)}
                                    class="text-gray-700 underline"
                                >
                                    {#if synced}
                                        Force sync
                                    {:else}
                                        Sync card
                                    {/if}
                                </button>
                            </span>
                            <span>
                                <button
                                    on:click={() => deleteCard(card)}
                                    class="text-red-800 underline"
                                >
                                    Delete
                                </button>
                            </span>
                        </div>
                    </div>
                </details>
            </li>
        {/each}
    {/if}
</ul>

<style lang="postcss">
    .btn {
        @apply my-auto mx-2 rounded border border-gray-400 bg-white py-2 px-4 text-sm font-semibold text-gray-800 shadow;
    }
    .btn:hover {
        @apply hover:bg-gray-100;
    }
</style>
