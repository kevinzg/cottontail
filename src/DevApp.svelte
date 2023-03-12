<script lang="ts">
    import type { IFlashcardData } from './lib/types';
    import * as service from './lib/service';
    import Cottontail from './Cottontail.svelte';
    import Dashboard from './Dashboard.svelte';

    let tab: 'sample' | 'dashboard' = 'sample';

    async function save(ev: CustomEvent<IFlashcardData>) {
        service.saveCard(ev.detail);
    }
</script>

<div class="mx-auto w-fit bg-gray-50 py-1">
    <label>
        <input type="radio" bind:group={tab} value="sample" />
        Sample page
    </label>
    <label>
        <input type="radio" bind:group={tab} value="dashboard" />
        Dashboard
    </label>
</div>

<hr />

{#if tab === 'sample'}
    <main class="mx-auto my-8 w-96 space-y-4 text-gray-800">
        <h1 class="text-center text-3xl font-bold">Sample text</h1>
        <img
            alt="Black dunes"
            src="https://source.unsplash.com/8xznAGy4HcY/800x400"
        />
        <p>
            Aut omnis harum dolore itaque unde. Perspiciatis quis eum eveniet
            ab. Quia voluptatem tempore cumque libero. Et quas assumenda porro
            explicabo. Assumenda ab provident ullam voluptatem.
        </p>
        <p>
            Aliquid minus sunt velit officia est quod. Et rerum asperiores
            dolores architecto maiores iure sed praesentium. Laudantium ipsam
            veritatis et sapiente molestiae enim odio temporibus. Pariatur aut
            laborum et nisi debitis.
        </p>
        <p>
            Laboriosam dicta blanditiis veritatis dolorem et. Architecto in
            omnis minus. In quae consequatur est voluptatibus doloremque porro
            sunt. Voluptate quasi laborum voluptates cumque reprehenderit quos
            architecto.
        </p>
        <p>
            Debitis eum earum et dolorum aspernatur sint exercitationem. Et eum
            quasi tempore ea. Et sed modi rerum dicta molestias facere aliquam.
        </p>
        <p>
            Neque et ex ut voluptatem. Quia quo nesciunt quia numquam. Vero
            reiciendis aut nostrum rerum vel quidem adipisci.
        </p>
    </main>

    <Cottontail on:save={save} />
{:else if tab === 'dashboard'}
    <Dashboard />
{/if}
