<script lang="ts">
    import { liveQuery } from 'dexie';
    import type { Readable } from 'svelte/store';
    import { Database } from './lib/database';
    import type { ICard } from './lib/types';

    const db = new Database();
    (window as any).db = db;

    // @ts-ignore
    let cards = liveQuery<ICard[]>(() => db.cards.toArray()) as Readable<
        ICard[]
    >;

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
            | Exclude<keyof ICard, 'source' | 'id'>
            | 'sourceURL'
            | 'sourceName';
        const fields: Array<CSVFields> = [
            'uuid',
            'title',
            'content',
            'category',
            'sourceURL',
            'sourceName',
            'createdAt',
            'updatedAt',
        ];
        const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
        const format: Record<CSVFields, (card: ICard) => string> = {
            uuid: (card) => card.uuid,
            title: (card) => escape(card.title),
            content: (card) => escape(card.content.text),
            category: (card) => card.category,
            sourceURL: (card) => escape(card.source.url),
            sourceName: (card) => escape(card.source.name),
            createdAt: (card) => card.createdAt.toISOString(),
            updatedAt: (card) => card.updatedAt.toISOString(),
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
</script>

<div class="flex flex-row px-3">
    <h1 class="flex-grow justify-center py-2 text-xl font-bold text-gray-800">
        Cottontail Dashboard
    </h1>
    <button on:click={exportCSV} class="btn justify-center"
        >Export as CSV</button
    >
    <button on:click={exportJSON} class="btn justify-center"
        >Export as JSON</button
    >
</div>

<hr />

<!-- TODO: Pagination -->
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
                                    rel="noreferrer"
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

<style lang="postcss">
    .btn {
        @apply my-auto mx-2 rounded border border-gray-400 bg-white py-2 px-4 text-sm font-semibold text-gray-800 shadow;
    }
    .btn:hover {
        @apply hover:bg-gray-100;
    }
</style>
