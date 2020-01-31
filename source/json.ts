import * as libcollections from "collections/index";
import * as libreader from "utils/reader";
import { $ } from "utils/utils";

// investigate upcastable
// write serializer with formatting options

class Value implements libcollections.Serializable {
	constructor() {

	}

	asArray(): Array {
		throw new Error($(""));
	}

	isArray(): boolean {
		return false;
	}

	asBoolean(): Boolean {
		throw new Error($(""));
	}

	isBoolean(): boolean {
		return false;
	}

	asFalse(): False {
		throw new Error($(""));
	}

	isFalse(): boolean {
		return false;
	}

	asNull(): Null {
		throw new Error($(""));
	}

	isNull(): boolean {
		return false;
	}

	asNumber(): Number {
		throw new Error($(""));
	}

	isNumber(): boolean {
		return false;
	}

	asObject(): Object {
		throw new Error($(""));
	}

	isObject(): boolean {
		return false;
	}

	asString(): String {
		throw new Error($(""));
	}

	isString(): boolean {
		return false;
	}

	asTrue(): True {
		throw new Error($(""));
	}

	isTrue(): boolean {
		return false;
	}

	asWhitespace(): Whitespace {
		throw new Error($(""));
	}

	isWhitespace(): boolean {
		return false;
	}

	toString(): string {
		throw new Error($(""));
	}
}

class Array extends Value {
	private values: libcollections.StrongArray<Value>;

	constructor() {
		super();
		this.values = new libcollections.StrongArray<Value>();
	}

	asArray(): Array {
		return this;
	}

	isArray(): boolean {
		return true;
	}

	toString(): string {
		return this.values.toString();
	}

	add(value: Value): this {
		this.values.add(value);
		return this;
	}
}

class Boolean extends Value {
	private value: boolean;

	constructor(value: boolean) {
		super();
		this.value = value;
	}

	asBoolean(): Boolean {
		return this;
	}

	isBoolean(): boolean {
		return true;
	}

	toString(): string {
		return (this.value) ? "true" : "false";
	}
}

class False extends Value {
	constructor() {
		super();
	}

	asFalse(): False {
		return this;
	}

	isFalse(): boolean {
		return true;
	}

	toString(): string {
		return "false";
	}

	static readonly INSTANCE = new False();
}

class Null extends Value {
	constructor() {
		super();
	}

	asNull(): Null {
		return this;
	}

	isNull(): boolean {
		return true;
	}

	toString(): string {
		return "null";
	}

	static readonly INSTANCE = new Null();
}

class Number extends Value {
	private value: string;

	constructor(value: string) {
		super();
		// TODO
		this.value = value;
	}

	asNumber(): Number {
		return this;
	}

	isNumber(): boolean {
		return true;
	}

	toString(): string {
		return this.value;
	}
}

class Object extends Value {
	private values: libcollections.StrongMap<String, Value>;

	constructor() {
		super();
		this.values = new libcollections.StrongMap<String, Value>();
	}

	asObject(): Object {
		return this;
	}

	isObject(): boolean {
		return true;
	}

	toString(): string {
		return this.values.toString();
	}

	add(key: String, value: Value): this {
		this.values.add(key, value);
		return this;
	}
}

class String extends Value {
	private value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	asString(): String {
		return this;
	}

	isString(): boolean {
		return true;
	}

	toString(): string {
		return $("\"", this.value, "\""); // TODO
	}
}

class True extends Value {
	constructor() {
		super();
	}

	asTrue(): True {
		return this;
	}

	isTrue(): boolean {
		return true;
	}

	toString(): string {
		return "true";
	}

	static readonly INSTANCE = new True();
}

class Whitespace extends Value {
	private value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	asWhitespace(): Whitespace {
		return this;
	}

	isWhitespace(): boolean {
		return true;
	}

	toString(): string {
		return this.value;
	}
}

export {
	Value,
	Array,
	Boolean,
	False,
	Null,
	Number,
	Object,
	String,
	True,
	Whitespace
};
