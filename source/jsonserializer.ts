interface ObjectWithFromEntries {
	fromEntries(iterable: Iterable<any>): {}
}

interface Target {
	write(string: string): void
}

export function serialize(json: any, target: Target, eol: string = "\r\n"): void {
	if (json === undefined) {
		target.write("null");
	} else if (json === null) {
		target.write("null");
	} else if (json.constructor === Boolean) {
		target.write(JSON.stringify(json));
	} else if (json.constructor === Number) {
		target.write(JSON.stringify(json));
	} else if (json.constructor === String) {
		target.write(JSON.stringify(json));
	} else if (json.constructor === Array) {
		target.write("[");
		if (json.length > 0) {
			for (let i = 0; i < json.length; i++) {
				target.write(eol + "\t");
				serialize(json[i], target, eol + "\t");
				if (i < json.length - 1) {
					target.write(",");
				}
			}
			target.write(eol);
		}
		target.write("]");
	} else if (json.constructor === Object) {
		let keys = Object.keys(json);
		target.write("{");
		if (keys.length > 0) {
			for (let i = 0; i < keys.length; i++) {
				target.write(eol + "\t");
				target.write(JSON.stringify(keys[i]));
				target.write(": ");
				serialize(json[keys[i]], target, eol + "\t");
				if (i < keys.length - 1) {
					target.write(",");
				}
			}
			target.write(eol);
		}
		target.write("}");
	} else if (json.constructor === Map) {
		serialize((Object as unknown as ObjectWithFromEntries).fromEntries(json), target);
	} else if (json.constructor === Set) {
		serialize(Array.from(json), target);
	} else {
		throw "Expected serializable data!";
	}
}

serialize(new Set<string>(["value", "value"]), process.stdout);
