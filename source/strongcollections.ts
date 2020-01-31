import { $ } from "./utils";

interface Serializable {
	toString(): string;
}

class StrongArray<V extends Serializable> implements Serializable {
	private values: Array<V>;

	constructor() {
		this.values = new Array<V>();
	}

	[Symbol.iterator](): Iterable<V> {
		return this.values[Symbol.iterator]();
	}

	add(value: V): this {
		this.values.push(value);
		return this;
	}

	toString(): string {
		let strings = new Array<string>();
		for (let value of this.values) {
			strings.push(value.toString());
		}
		return $("[", strings.join(","), "]");
	}

	transform<V2>(transformer: { (value: V): V2 }): StrongArray<V2> {
		let that = new StrongArray<V2>();
		for (let value of this.values) {
			that.values.push(transformer(value));
		}
		return that;
	}
}

class StrongMap<K extends Serializable, V extends Serializable> implements Serializable {
	private values: Map<K, V>;

	constructor() {
		this.values = new Map<K, V>();
	}

	[Symbol.iterator](): Iterable<[K, V]> {
		return this.values[Symbol.iterator]();
	}

	add(key: K, value: V): this {
		this.values.set(key, value);
		return this;
	}

	toString(): string {
		let strings = new Array<string>();
		for (let [key, value] of this.values) {
			strings.push($(key.toString(), ":", value.toString()));
		}
		return $("{", strings.join(","), "}");
	}

	transform<K2, V2>(transformer: { (value: [K, V]): [K2, V2] }): StrongMap<K2, V2> {
		let that = new StrongMap<K2, V2>();
		for (let [key, value] of this.values) {
			that.values.set(...transformer([key, value]));
		}
		return that;
	}
}

class StrongSet<V extends Serializable> implements Serializable {
	private values: Set<V>;

	constructor() {
		this.values = new Set<V>();
	}

	[Symbol.iterator](): Iterable<V> {
		return this.values[Symbol.iterator]();
	}

	add(value: V): this {
		this.values.add(value);
		return this;
	}

	toString(): string {
		let strings = new Array<string>();
		for (let value of this.values) {
			strings.push(value.toString());
		}
		return $("<", strings.join(","), ">");
	}

	transform<V2>(transformer: { (value: V): V2 }): StrongSet<V2> {
		let that = new StrongSet<V2>();
		for (let value of this.values) {
			that.values.add(transformer(value));
		}
		return that;
	}
}

export {
	Serializable,
	StrongArray,
	StrongMap,
	StrongSet
};
