"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chunk = void 0;
class Chunk {
    constructor() { }
    static fromString(string, encoding) {
        if (encoding === "binary") {
            let bytes = new Array();
            for (let i = 0; i < string.length; i += 1) {
                let byte = string.charCodeAt(i);
                bytes.push(byte);
            }
            return Uint8Array.from(bytes);
        }
        if (encoding === "base64") {
            // @ts-ignore
            return Chunk.fromString(atob(string), "binary");
        }
        if (encoding === "base64url") {
            return Chunk.fromString(string.replaceAll("-", "+").replaceAll("_", "/"), "base64");
        }
        if (encoding === "hex") {
            if (string.length % 2 === 1) {
                string = `0${string}`;
            }
            let bytes = new Array();
            for (let i = 0; i < string.length; i += 2) {
                let part = string.slice(i, i + 2);
                let byte = Number.parseInt(part, 16);
                bytes.push(byte);
            }
            return Uint8Array.from(bytes);
        }
        // @ts-ignore
        return new TextEncoder().encode(string);
    }
    static toString(chunk, encoding) {
        if (encoding === "binary") {
            let parts = new Array();
            for (let byte of chunk) {
                let part = String.fromCharCode(byte);
                parts.push(part);
            }
            return parts.join("");
        }
        if (encoding === "base64") {
            // @ts-ignore
            return btoa(Chunk.toString(chunk, "binary"));
        }
        if (encoding === "base64url") {
            return Chunk.toString(chunk, "base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
        }
        if (encoding === "hex") {
            let parts = new Array();
            for (let byte of chunk) {
                let part = byte.toString(16).toUpperCase().padStart(2, "0");
                parts.push(part);
            }
            return parts.join("");
        }
        // @ts-ignore
        return new TextDecoder().decode(chunk);
    }
    static equals(one, two) {
        return this.comparePrefixes(one, two) === 0;
    }
    static comparePrefixes(one, two) {
        for (let i = 0; i < Math.min(one.length, two.length); i++) {
            let a = one[i];
            let b = two[i];
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
        }
        if (one.length < two.length) {
            return -1;
        }
        if (one.length > two.length) {
            return 1;
        }
        return 0;
    }
    static concat(buffers) {
        let length = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
        let result = new Uint8Array(length);
        let offset = 0;
        for (let buffer of buffers) {
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }
}
exports.Chunk = Chunk;
;