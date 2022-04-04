<script lang="ts">
    const submit = (ev: SubmitEvent) => {
        const form: HTMLFormElement = ev.target as any;
        const data = new FormData(form);
        console.log(Object.fromEntries([...data.entries()]));
    };
</script>

<form on:submit|preventDefault={submit}>
    <div>
        <label for="title">Title</label>
        <input name="title" class="border border-gray-900" id="title" />
    </div>

    <div>
        <label for="front">Front</label>
        <textarea name="front" id="front" />
    </div>

    <div>
        <label for="back">Back</label>
        <textarea name="back" id="back" />
    </div>

    <div>
        <button type="submit" class="bg-gray-300 p-1">Submit</button>
    </div>
</form>
