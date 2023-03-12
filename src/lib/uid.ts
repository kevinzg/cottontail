export type UID = string; // UUID format

/**
 * Returns a 128-bit unique id. Based in Timeflake.
 * 48 bits for the current timestamp in milliseconds.
 * 80 bits for a cryptographically generated random number.
 */
export function randomUID(now?: Date): UID {
    now ??= new Date();
    const ts = BigInt(now.getTime());
    const id = new Uint32Array(4);
    globalThis.crypto.getRandomValues(id);

    id[0] = Number((ts >> 16n) & 0xffffffffn);
    id[1] = Number((BigInt(id[1]) & 0x0000ffffn) | ((ts & 0xffffn) << 16n));

    return toUUIDString(id);
}

/**
 * Coverts a 4-items Uint32Array to a UUID string:
 *     aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
 * @param uid
 * @returns
 */
function toUUIDString(uid: Uint32Array): string {
    const hex = [...uid].map((x) => x.toString(16).padStart(8, '0')).join('');
    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20),
    ].join('-');
}
