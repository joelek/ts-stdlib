import { Reader } from "./reader";

abstract class Token {

}

class DoubleQuotedString extends Token {
	protected constructor(readonly state: Readonly<{
		string: string
	}>) {
		super();
	}

	private static parse1(reader: Reader): string {
		if (/[^\n\r\f"]/.test(reader.peek(1))) {
			return reader.read(1);
		}
		throw "";
	}

	private static parse2(reader: Reader): string {
		let string = reader.read("\\");
		try {
			return string + reader.read("\n");
		} catch (error) {}
		try {
			return string + reader.read("\r\n");
		} catch (error) {}
		try {
			return string + reader.read("\r");
		} catch (error) {}
		try {
			return string + reader.read("\f");
		} catch (error) {}
		throw "";
	}

	private static parse3(reader: Reader): string {
		if (/[^\0x00-\0x7F]/.test(reader.peek(1))) {
			return reader.read(1);
		}
		throw "";
	}

	private static parse4(reader: Reader): string {
		let string = reader.read("\\");
		for (let i = 0; i < 1; i++) {
			let c = reader.read(1);
			if (!/[0-9a-fA-F]/.test(c)) {
				throw "";
			}
			string += c;
		}
		for (let i = 1; i < 6; i++) {
			let c = reader.read(1);
			if (!/[0-9a-fA-F]/.test(c)) {
				break;
			}
			string += c;
		}
		try {
			string += reader.read("\r\n");
		} catch (error) {}
		if (/[ \n\r\t\f]/.test(reader.peek(1))) {
			string += reader.read(1);
		}
		return string;
	}

	private static parse5(reader: Reader): string {
		let string = reader.read("\\");
		if (/[^\n\r\f0-9a-fA-F]/.test(reader.peek(1))) {
			return string + reader.read(1);
		}
		throw "";
	}

	static parse(reader: Reader): DoubleQuotedString {
		let string = "";
		reader.read("\"");
		while (!reader.done()) {
			let offset = reader.tell();
			for (let parser of [
				this.parse1,
				this.parse2,
				this.parse3,
				this.parse4,
				this.parse5
			]) {
				try {
					string += parser(reader);
					continue;
				} catch (error) {
					reader.seek(offset);
				}
			}
		}
		reader.read("\"");
		return new DoubleQuotedString({
			string
		});
	}
}

class SingleQuotedString extends Token {
	protected constructor(readonly state: Readonly<{
		string: string
	}>) {
		super();
	}

	static parse(reader: Reader): SingleQuotedString {
		let string = "";
		reader.read("'");
		while (!reader.done()) {
			if (reader.peek(1) === "'") {
				break;
			}
		}

		reader.read("'");
		return new SingleQuotedString({
			string
		});
	}
}

class Identifier extends Token {
	protected constructor(readonly state: Readonly<{
		string: string
	}>) {
		super();
	}

	static parse(reader: Reader): Identifier {
		let string = "";
		if (reader.peek(1) === "-") {
			string = reader.read(1);
		}
		if (!/[_a-zA-Z]/.test(reader.peek(1))) {
			throw "";
		}
		string += reader.read(1);
		while (!reader.done()) {
			if (!/[_a-zA-Z0-9-]/.test(reader.peek(1))) {
				break;
			}
			string += reader.read(1);
		}
		return new Identifier({
			string
		});
	}
}

abstract class NamespacePrefix {
	static parse(reader: Reader): NamespacePrefix {
		let offset = reader.tell();
		for (let producer of [
			NoNamespacePrefix,
			WildcardNamespacePrefix,
			NamedNamespacePrefix
		]) {
			try {
				return producer.parse(reader);
			} catch (error) {
				reader.seek(offset);
			}
		}
		throw "Unable to parse NamespacePrefix!";
	}
}

class NoNamespacePrefix extends NamespacePrefix {
	protected constructor(readonly state: Readonly<{
	}>) {
		super();
	}

	static parse(reader: Reader): WildcardNamespacePrefix {
		reader.read("|");
		return new NoNamespacePrefix({});
	}
}

class WildcardNamespacePrefix extends NamespacePrefix {
	protected constructor(readonly state: Readonly<{
	}>) {
		super();
	}

	static parse(reader: Reader): WildcardNamespacePrefix {
		reader.read("*|");
		return new WildcardNamespacePrefix({});
	}
}

class NamedNamespacePrefix extends NamespacePrefix {
	protected constructor(readonly state: Readonly<{
		identifier: Identifier
	}>) {
		super();
	}

	static parse(reader: Reader): NamedNamespacePrefix {
		let identifier = Identifier.parse(reader);
		reader.read("|");
		return new NamedNamespacePrefix({
			identifier
		});
	}
}

abstract class SimpleSelector {
	static parse(reader: Reader): SimpleSelector {
		let offset = reader.tell();
		for (let producer of [
			TypeSelector,
			UniversalSelector,
			ClassSelector
		]) {
			try {
				return producer.parse(reader);
			} catch (error) {
				reader.seek(offset);
			}
		}
		throw "Unable to parse SimpleSelector!";
	}
}

class TypeSelector extends SimpleSelector {
	protected constructor(readonly state: Readonly<{
		namespacePrefix: NamespacePrefix | null,
		identifier: Identifier
	}>) {
		super();
	}

	static parse(reader: Reader): TypeSelector {
		let namespacePrefix: NamespacePrefix | null = null;
		try {
			namespacePrefix = NamespacePrefix.parse(reader);
		} catch (error) {}
		let identifier = Identifier.parse(reader);
		return new TypeSelector({
			namespacePrefix,
			identifier
		});
	}
}

class UniversalSelector extends SimpleSelector {
	protected constructor(readonly state: Readonly<{
		namespacePrefix: NamespacePrefix | null
	}>) {
		super();
	}

	static parse(reader: Reader): UniversalSelector {
		let namespacePrefix: NamespacePrefix | null = null;
		try {
			namespacePrefix = NamespacePrefix.parse(reader);
		} catch (error) {}
		reader.read("*");
		return new UniversalSelector({
			namespacePrefix
		});
	}
}

class ClassSelector extends SimpleSelector {
	protected constructor(readonly state: Readonly<{
		identifier: Identifier
	}>) {
		super();
	}

	static parse(reader: Reader): ClassSelector {
		reader.read(".");
		let identifier = Identifier.parse(reader);
		return new ClassSelector({
			identifier
		});
	}
}

class AttributeSelector extends SimpleSelector {
	protected constructor(readonly state: Readonly<{
		namespacePrefix: NamespacePrefix | null
	}>) {
		super();
	}

	static parse(reader: Reader): AttributeSelector {
		let namespacePrefix: NamespacePrefix | null = null;
		reader.read("[");
		reader.skip(" \t\r\n\f");
		try {
			namespacePrefix = NamespacePrefix.parse(reader);
		} catch (error) {}
		let identifier = Identifier.parse(reader);
		reader.skip(" \t\r\n\f");
		// operator
		reader.skip(" \t\r\n\f");


		reader.read("]");
		return new AttributeSelector({
			namespacePrefix
		});
	}
}

let reader = new Reader("");
