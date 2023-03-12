<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { IFlashcard, IFlashcardData } from './types';

    const dispatch = createEventDispatcher();

    let kind: IFlashcard['kind'] = 'basic';
    let front = '';
    let back = '';
    let deck = 'default';
    let sourceURL = window.location.toString();
    let sourceName = window.document.title;

    let labelFront: string;
    let labelBack: string;
    let placeholderFront: string;
    let placeholderBack: string;

    $: {
        if (kind === 'basic' || kind === 'reverse') {
            labelFront = 'Front';
            labelBack = 'Back';
            placeholderFront = 'Question';
            placeholderBack = 'Answer';
        } else if (kind === 'cloze') {
            labelFront = 'Text';
            labelBack = 'Extra';
            placeholderFront =
                '{{c2::Canberra::city}} was founded in {{c1::1913::year}}';
            placeholderBack = '';
        }
    }

    const submit = () => {
        const card: IFlashcardData = {
            kind,
            front,
            back,
            deck: deck || 'default',
            source: {
                url: sourceURL,
                title: sourceName,
            },
        };
        dispatch('save', card);
    };

    const cancel = () => {
        dispatch('cancel');
    };
</script>

<form
    on:submit|stopPropagation|preventDefault={submit}
    class="flex h-full flex-col space-y-1 text-gray-800"
>
    <div class="flex space-x-2">
        <fieldset class="flex flex-grow flex-col">
            <label class="text-sm font-semibold text-gray-600" for="ct-deck"
                >Deck</label
            >
            <input
                id="ct-deck"
                name="ct-deck"
                placeholder="default"
                class="ml-2 border border-gray-300 bg-white py-1 px-1 text-sm"
                bind:value={deck}
                on:keydown|stopPropagation
            />
        </fieldset>

        <fieldset class="flex flex-grow flex-col">
            <label class="text-sm font-semibold text-gray-600" for="ct-kind"
                >Kind</label
            >
            <select
                id="ct-kind"
                name="ct-kind"
                class="ml-2 h-8 border border-gray-300 bg-white py-1 px-1 text-sm"
                bind:value={kind}
                on:keydown|stopPropagation
            >
                <option value="basic">Basic</option>
                <option value="reverse">Reversable</option>
                <option value="cloze">Cloze</option>
            </select>
        </fieldset>
    </div>

    <fieldset class="flex flex-grow flex-col">
        <label class="text-sm font-semibold text-gray-600" for="ct-front"
            >{labelFront}</label
        >
        <textarea
            id="ct-front"
            name="ct-front"
            class="ml-2 grow border border-gray-300 bg-white py-1 px-1 font-mono text-sm"
            rows="3"
            required
            bind:value={front}
            on:keydown|stopPropagation
            placeholder={placeholderFront}
        />
    </fieldset>

    <fieldset class="flex flex-grow flex-col">
        <label class="text-sm font-semibold text-gray-600" for="ct-back"
            >{labelBack}</label
        >
        <textarea
            id="ct-back"
            name="ct-back"
            class="ml-2 grow border border-gray-300 bg-white py-1 px-1 font-mono text-sm "
            rows="3"
            bind:value={back}
            on:keydown|stopPropagation
            placeholder={placeholderBack}
        />
    </fieldset>

    <fieldset class="flex flex-col">
        <label class="text-sm font-semibold text-gray-600" for="ct-sourceName"
            >Source</label
        >
        <div class="ml-2 flex flex-row space-x-1.5">
            <input
                id="ct-sourceName"
                name="ct-sourceName"
                placeholder="Name"
                class="grow border border-gray-300 bg-white py-1 px-1 text-sm "
                bind:value={sourceName}
                on:keydown|stopPropagation
            />
            <input
                id="ct-sourceUrl"
                name="ct-sourceUrl"
                placeholder="URL"
                class="border border-gray-300 bg-white py-1 px-1 text-sm"
                bind:value={sourceURL}
                on:keydown|stopPropagation
            />
        </div>
    </fieldset>

    <div class="flex flex-row-reverse justify-around py-2">
        <button
            class="rounded border border-gray-400 bg-white py-1 px-2 text-sm font-semibold text-gray-800 shadow hover:bg-gray-100"
        >
            Submit
        </button>
        <button
            class="rounded border border-gray-400 bg-white py-1 px-2 text-sm font-medium text-gray-600 shadow hover:bg-gray-100"
            on:click|stopPropagation|preventDefault={cancel}
        >
            Cancel
        </button>
    </div>
</form>
