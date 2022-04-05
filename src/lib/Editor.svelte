<script lang="ts">
    import Quill from 'quill';
    import { onMount } from 'svelte';

    let div: HTMLDivElement;
    let quill: Quill;

    onMount(() => {
        quill = new Quill(div, {
            theme: 'snow',
        });
    });

    export const getContent = () => ({
        text: quill.getText(),
        html: quill.root.innerHTML,
        delta: quill.getContents(),
    });
</script>

<div class="bg-gray-50">
    <div bind:this={div} class="h-32 bg-white" />
</div>

<style>
    @import 'quill/dist/quill.snow.css';
</style>
