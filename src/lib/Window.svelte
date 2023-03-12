<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { fromEvent } from 'rxjs';
    import {
        map,
        startWith,
        pairwise,
        scan,
        takeUntil,
        mergeMap,
    } from 'rxjs/operators';

    const dispatch = createEventDispatcher();

    export let x: number = 0;
    export let y: number = 0;
    export let hidden: boolean = false;

    const startPosition = { x, y };

    let titleBar: HTMLElement;

    onMount(() => {
        const mouseDown$ = fromEvent<MouseEvent>(titleBar, 'mousedown');
        const mouseUp$ = fromEvent<MouseEvent>(window.document, 'mouseup');
        const mouseMove$ = fromEvent<MouseEvent>(window.document, 'mousemove');

        const sub = mouseDown$
            .pipe(
                mergeMap((mouseDownEvent: MouseEvent) => {
                    return mouseMove$.pipe(
                        startWith(mouseDownEvent),
                        pairwise(),
                        map(([ev1, ev2]: [MouseEvent, MouseEvent]) => {
                            return {
                                dx: ev2.clientX - ev1.clientX,
                                dy: ev2.clientY - ev1.clientY,
                            };
                        }),
                        takeUntil(mouseUp$)
                    );
                }),
                scan(
                    (s, m) => ({
                        x: s.x + m.dx,
                        y: s.y + m.dy,
                    }),
                    startPosition
                )
            )
            .subscribe((state) => {
                x = state.x;
                y = state.y;
            });

        return () => {
            sub.unsubscribe();
        };
    });
</script>

<div
    style="left: {x}px; top: {y}px;"
    class="pattern-bg window rounded border border-gray-300 shadow-lg"
    class:hidden
>
    <div
        bind:this={titleBar}
        class="title-bar flex cursor-move flex-row items-center justify-between border-b border-gray-300 bg-white bg-gradient-to-b from-gray-100 to-gray-300 px-1 py-0.5 text-center text-sm font-medium text-gray-600"
    >
        <span>🐰</span>
        <span>Cottontail</span>
        <button
            on:click={() => dispatch('close')}
            class="flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-white hover:bg-gray-500"
        >
            <span class="sr-only">Minimize</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="4"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7 12H17"
                />
            </svg>
        </button>
    </div>
    <div class="window-content overflow-auto py-1 px-2">
        <slot />
    </div>
</div>
