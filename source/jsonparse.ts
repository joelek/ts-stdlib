import * as libjson from "json/json";
import * as libreader from "./reader";
import { $ } from "./utils";
import { read } from "fs";

function readWhitespace(reader: libreader.Reader): libjson.Whitespace {
	let values = new Array<string>();
	while (!reader.done()) {
		let a = reader.peek(1);
		if ((a !== " ") && (a !== "\n") && (a !== "\r") && (a !== "\t")) {
			break;
		}
		reader.skip(1);
		values.push(a);
	}
	let value = values.join("");
	return new libjson.Whitespace(value);
}

function readNull(reader: libreader.Reader): libjson.True {
	reader.word("null");
	return libjson.Null.INSTANCE;
}

function readFalse(reader: libreader.Reader): libjson.True {
	reader.word("false");
	return libjson.False.INSTANCE;
}

function readTrue(reader: libreader.Reader): libjson.True {
	reader.word("true");
	return libjson.True.INSTANCE;
}

function readString(reader: libreader.Reader): libjson.String {
	reader.word("\"");
	let values = new Array<string>();
	while (!reader.done()) {
		let a = reader.peek(1);
		if (a === "\"") {
			break;
		}
		reader.skip(1);
		if (a === "\\") {
			let b = reader.read(1);
			if (false) {
			} else if (b === "\"") {
				values.push("\"");
			} else if (b === "\\") {
				values.push("\\");
			} else if (b === "\/") {
				values.push("\/");
			} else if (b === "b") {
				values.push("\b");
			} else if (b === "f") {
				values.push("\f");
			} else if (b === "n") {
				values.push("\n");
			} else if (b === "r") {
				values.push("\r");
			} else if (b === "t") {
				values.push("\t");
			} else if (b === "u") {
				let string = reader.read(4);
				if (!/^[0-9a-fA-F]*$/.test(string)) {
					throw new Error($());
				}
				let value = String.fromCharCode(parseInt(string, 16));
				values.push(value);
			} else {
				values.push(b);
			}
		} else {
			values.push(a);
		}
	}
	reader.word("\"");
	return new libjson.String(values.join(""));
}

function readNumber(reader: libreader.Reader): libjson.Number {
	throw new Error($());
}

function readObject(reader: libreader.Reader): libjson.Object {
	reader.word("{");
	readWhitespace(reader);
	let object = new libjson.Object();
	if (reader.peek(1) !== "}") {
		while (!reader.done()) {
			let key = readString(reader);
			readWhitespace(reader);
			reader.word(":");
			let value = readValue(reader);
			object.add(key, value);
			let b = reader.peek(1);
			if (b === "}") {
				break;
			}
			reader.word(",");
			readWhitespace(reader);
		}
	}
	reader.word("}");
	return object;
}

function readArray(reader: libreader.Reader): libjson.Array {
	reader.word("[");
	readWhitespace(reader);
	let array = new libjson.Array();
	if (reader.peek(1) !== "]") {
		while (!reader.done()) {
			let value = readValue(reader);
			array.add(value);
			let b = reader.peek(1);
			if (b === "]") {
				break;
			}
			reader.word(",");
		}
	}
	reader.word("]");
	return array;
}

function readValue(reader: libreader.Reader): libjson.Value {
	let offset = reader.tell();
	try {
		readWhitespace(reader);
		let value = readString(reader);
		readWhitespace(reader);
		return value;
	} catch (error) {
		console.log(error, "!string");
		reader.seek(offset);
	}
	try {
		readWhitespace(reader);
		let value = readObject(reader);
		readWhitespace(reader);
		return value;
	} catch (error) {
		console.log(error, "!object");
		reader.seek(offset);
	}
	try {
		readWhitespace(reader);
		let value = readArray(reader);
		readWhitespace(reader);
		return value;
	} catch (error) {
		console.log(error, "!array");
		reader.seek(offset);
	}
	try {
		readWhitespace(reader);
		let value = readTrue(reader);
		readWhitespace(reader);
		return value;
	} catch (error) {
		console.log(error, "!true");
		reader.seek(offset);
	}
	try {
		readWhitespace(reader);
		let value = readFalse(reader);
		readWhitespace(reader);
		return value;
	} catch (error) {
		console.log(error, "!false");
		reader.seek(offset);
	}
	try {
		readWhitespace(reader);
		let value = readNull(reader);
		readWhitespace(reader);
		return value;
	} catch (error) {
		console.log(error, "!null");
		reader.seek(offset);
	}
	try {
		readWhitespace(reader);
		let value = readNumber(reader);
		readWhitespace(reader);
		return value;
	} catch (error) {
		console.log(error, "!number");
		reader.seek(offset);
	}
	throw new Error($());
}
/*
let reader = new libreader.Reader('{"key":"value"}');
let deserialized = readValue(reader);
console.log(deserialized.toString());

let serialized = new libjson.Object()
	.add(new libjson.String("key"), new libjson.String("value1"))
	.add(new libjson.String("key"), new libjson.String("value2"))
	.toString();
console.log(serialized);
*/
