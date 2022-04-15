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

    export let hidden: boolean = false;
</script>

<div
    style="left: {x}px; top: {y}px;"
    class="waves window rounded border border-gray-900/20 shadow-lg"
    class:hidden
>
    <div
        bind:this={titleBar}
        class="title-bar cursor-move bg-gradient-to-b from-gray-100 to-gray-300 text-center text-sm font-medium text-gray-600"
    >
        <span>Cottontail</span>
        <!-- TODO: style -->
        <button class="bg-red-300" on:click={() => dispatch('close')}>
            Close
        </button>
    </div>
    <div class="window-content overflow-auto py-1 px-2">
        <slot />
    </div>
</div>

<style>
    .window {
        position: fixed;
        overflow: hidden;
        user-select: none;
        z-index: 9999;
    }

    .window-content {
        resize: both;
        min-width: 480px;
    }
</style>
