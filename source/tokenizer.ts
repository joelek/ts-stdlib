type MatchState = "y" | "n" | "?";

interface Matcher {
	matches(): MatchState;
	reset(): void;
	update(char: string): void;
}

class CharMatcher implements Matcher {
	private ranges: Array<[string, string]>;
	private negated: boolean;
	private state: MatchState;

	constructor(string: string) {
		this.negated = false;
		this.ranges = new Array<[string, string]>();
		if (string[0] === "^") {
			this.negated = true;
			string = string.slice(1);
		}
		let re = /(([^-]-[^-])|(.))/g;
		let parts: RegExpExecArray | null = null;
		while ((parts = re.exec(string)) != null) {
			let string = parts[1];
			let one = string[0];
			let two = (string.length === 3 ? string[2] : one);
			let min = (one < two ? one : two);
			let max = (one > two ? one : two);
			this.ranges.push([min, max]);
		}
		this.reset();
	}

	matches(): MatchState {
		return this.state;
	}

	reset(): void {
		this.state = "?";
	}

	update(char: string): void {
		if (this.state !== "n") {
			if (this.state === "y") {
				this.state = "n";
			} else {
				for (let range of this.ranges) {
					if ((char >= range[0]) && (char <= range[1])) {
						this.state = (this.negated ? "n" : "y");
						return;
					}
				}
				this.state = (this.negated ? "y" : "n");
			}
		}
	}
}

class WordMatcher implements Matcher {
	private string: string;
	private offset: number;
	private state: MatchState;

	constructor(string: string) {
		this.string = string;
		this.reset();
	}

	matches(): MatchState {
		return this.state;
	}

	reset(): void {
		this.offset = 0;
		this.state = "?";
	}

	update(char: string): void {
		if (this.matches() !== "n") {
			if (this.offset >= this.string.length) {
				this.state = "n";
			} else {
				if (this.string[this.offset++] !== char) {
					this.state = "n";
				} else {
					this.state = (this.offset === this.string.length ? "y" : "?");
				}
			}
		}
	}
}

class OrMatcher implements Matcher {
	private original: Array<Matcher>;
	private matchers: Array<Matcher>;

	constructor(...matchers: Array<Matcher>) {
		this.original = matchers;
		this.reset();
	}

	matches(): MatchState {
		if (this.matchers.length === 1) {
			return this.matchers[0].matches();
		}
		for (let matcher of this.matchers) {
			if (matcher.matches() !== "n") {
				return "?";
			}
		}
		return "n";
	}

	reset(): void {
		this.matchers = Array.from(this.original);
		for (let matcher of this.matchers) {
			matcher.reset();
		}
	}

	update(char: string): void {
		if (this.matches() !== "n") {
			let matchers = new Array<Matcher>();
			for (let matcher of this.matchers) {
				matcher.update(char);
				if (matcher.matches() !== "n") {
					matchers.push(matcher);
				}
			}
			this.matchers = matchers;
		}
	}
}

class RepeatMatcher implements Matcher {
	private min: number;
	private max: number;
	private matcher: Matcher;
	private repetitions: number;
	private updated: boolean;

	constructor(min: number, max: number, matcher: Matcher) {
		if (min < 0) {
			throw "Expected a non-negative number!";
		}
		if (max < 0) {
			throw "Expected a non-negative number!";
		}
		this.min = Math.min(min, max);
		this.max = Math.max(min, max);
		this.matcher = matcher;
		this.reset();
	}

	matches(): MatchState {
		let state = this.matcher.matches();
		if (state === "n") {
			return "n";
		}
		if (this.repetitions < this.min) {
			return "?";
		}
		if (this.repetitions > this.max) {
			return "n";
		}
		if (this.repetitions === this.max) {
			if (this.updated) {
				return "n";
			}
			return "y";
		}
		if (this.updated) {
			return "?"
		}
		return "y";
	}

	reset(): void {
		this.matcher.reset();
		this.repetitions = 0;
		this.updated = false;
	}

	update(char: string): void {
		if (this.matches() !== "n") {
			this.matcher.update(char);
			this.updated = true;
			if (this.matcher.matches() === "y") {
				this.repetitions += 1;
				this.matcher.reset();
				this.updated = false;
			}
		}
	}
}

class ConcatMatcher implements Matcher {
	private original: Array<Matcher>;
	private matchers: Array<Matcher>;
	private accepted: number;
	private state: MatchState;

	constructor(...matchers: Array<Matcher>) {
		this.original = matchers;
		this.reset();
	}

	matches(): MatchState {
		return this.state;
	}

	reset(): void {
		this.matchers = Array.from(this.original);
		this.accepted = 0;
		this.state = "?";
		for (let matcher of this.matchers) {
			matcher.reset();
		}
	}

	update(char: string): void {
		if (this.matches() !== "n") {
			if (this.accepted === this.matchers.length) {
				this.state = "n";
			} else {
				let matcher = this.matchers[this.accepted];
				matcher.update(char);
				let state = matcher.matches();
				if (state === "n") {
					this.state = "n";
				} else {
					if (state === "y") {
						this.accepted += 1;
						if (this.accepted === this.matchers.length) {
							this.state = "y";
						}
					}
				}
			}
		}
	}
}

let ns = {
	char(string: string): Matcher {
		return new CharMatcher(string);
	},
	word(string: string): Matcher {
		return new WordMatcher(string);
	},
	concat(...matchers: Array<Matcher>): Matcher {
		return new ConcatMatcher(...matchers);
	},
	repeat(min: number, max: number, matcher: Matcher): Matcher {
		return new RepeatMatcher(min, max, matcher);
	},
	or(...matchers: Array<Matcher>): Matcher {
		return new OrMatcher(...matchers);
	},
	star(matcher: Matcher): Matcher {
		return new RepeatMatcher(0, Infinity, matcher);
	},
	max(max: number, matcher: Matcher): Matcher {
		return new RepeatMatcher(0, max, matcher);
	},
	min(min: number, matcher: Matcher): Matcher {
		return new RepeatMatcher(min, Infinity, matcher);
	},
	plus(matcher: Matcher): Matcher {
		return new RepeatMatcher(1, Infinity, matcher);
	},
	opt(matcher: Matcher): Matcher {
		return new RepeatMatcher(0, 1, matcher);
	}
};








function test(expected: MatchState, string: string, matcher: Matcher): void {
	for (let char of string) {
		matcher.update(char);
	}
	let state = matcher.matches();
	if (state !== expected) {
		throw {
			state,
			expected,
			string,
			matcher
		};
	}
}

let $ident = () => ns.concat(
	ns.opt(ns.word("-")),
	$nmstart(),
	ns.opt($nmchar())
);

let $name = () => ns.plus($nmchar());

let $nmstart = () => ns.or(
	ns.char("_a-z"),
	$nonascii(),
	$escape()
);

let $nonascii = () => ns.char("^\u0000-\u007F");

let $unicode = () => ns.concat(
	ns.word("\\"),
	ns.repeat(1, 6, ns.char("0-9a-f")),
	ns.opt(ns.or(
		ns.word("\r\n"),
		ns.char(" \n\r\t\f")
	))
);

let $escape = () => ns.or(
	$unicode(),
	ns.concat(
		ns.word("\\"),
		ns.char("^\n\r\f0-9a-f")
	)
);

let $nmchar = () => ns.or(
	ns.char("_a-z0-9-"),
	$nonascii(),
	$escape()
);

let $num = () => ns.or(
	ns.plus(ns.char("0-9")),
	ns.concat(
		ns.star(ns.char("0-9")),
		ns.word("."),
		ns.plus(ns.char("0-9"))
	)
);

let $string = () => ns.or(
	$string1(),
	$string2()
);

let $string1 = () => ns.concat(
	ns.word("\""),
	ns.star(ns.or(
		ns.char("^\n\r\f\""),
		ns.concat(
			ns.word("\\"),
			$nl()
		),
		$nonascii(),
		$escape()
	)),
	ns.word("\"")
);

let $string2 = () => ns.concat(
	ns.word("'"),
	ns.star(ns.or(
		ns.char("^\n\r\f'"),
		ns.concat(
			ns.word("\\"),
			$nl()
		),
		$nonascii(),
		$escape()
	)),
	ns.word("'")
);

let $invalid = () => ns.or(
	$invalid1(),
	$invalid2()
);

let $invalid1 = () => ns.concat(
	ns.word("\""),
	ns.star(ns.or(
		ns.char("^\n\r\f\""),
		ns.concat(
			ns.word("\\"),
			$nl()
		),
		$nonascii(),
		$escape()
	))
);

let $invalid2 = () => ns.concat(
	ns.word("'"),
	ns.star(ns.or(
		ns.char("^\n\r\f'"),
		ns.concat(
			ns.word("\\"),
			$nl()
		),
		$nonascii(),
		$escape()
	))
);

let $nl = () => ns.or(
	ns.word("\n"),
	ns.word("\r\n"),
	ns.word("\r"),
	ns.word("\f")
);

let $w = () => ns.star(ns.char(" \t\r\n\f"));

let $d = () => ns.or(
	ns.word("d"),
	ns.concat(
		ns.word("\\"),
		ns.repeat(0, 4, ns.word("0")),
		ns.or(
			ns.word("44"),
			ns.word("64")
		),
		ns.opt(ns.or(
			ns.word("\r\n"),
			ns.char(" \t\r\n\f")
		))
	)
);

let $e = () => ns.or(
	ns.word("e"),
	ns.concat(
		ns.word("\\"),
		ns.repeat(0, 4, ns.word("0")),
		ns.or(
			ns.word("45"),
			ns.word("65")
		),
		ns.opt(ns.or(
			ns.word("\r\n"),
			ns.char(" \t\r\n\f")
		))
	)
);

let $n = () => ns.or(
	ns.word("n"),
	ns.concat(
		ns.word("\\"),
		ns.repeat(0, 4, ns.word("0")),
		ns.or(
			ns.word("4e"),
			ns.word("6e")
		),
		ns.opt(ns.or(
			ns.word("\r\n"),
			ns.char(" \t\r\n\f")
		))
	),
	ns.word("\\n")
);

let $o = () => ns.or(
	ns.word("o"),
	ns.concat(
		ns.word("\\"),
		ns.repeat(0, 4, ns.word("0")),
		ns.or(
			ns.word("4f"),
			ns.word("6f")
		),
		ns.opt(ns.or(
			ns.word("\r\n"),
			ns.char(" \t\r\n\f")
		))
	),
	ns.word("\\o")
);

let $t = () => ns.or(
	ns.word("t"),
	ns.concat(
		ns.word("\\"),
		ns.repeat(0, 4, ns.word("0")),
		ns.or(
			ns.word("54"),
			ns.word("74")
		),
		ns.opt(ns.or(
			ns.word("\r\n"),
			ns.char(" \t\r\n\f")
		))
	),
	ns.word("\\t")
);

let $v = () => ns.or(
	ns.word("v"),
	ns.concat(
		ns.word("\\"),
		ns.repeat(0, 4, ns.word("0")),
		ns.or(
			ns.word("58"),
			ns.word("78")
		),
		ns.opt(ns.or(
			ns.word("\r\n"),
			ns.char(" \t\r\n\f")
		))
	),
	ns.word("\\v")
);

type TokenType =
	"S" |
	"INCLUDES";/* |
	"DASHMATCH" |
	"PREFIXMATCH" |
	"SUFFIXMATCH" |
	"SUBSTRINGMATCH" |
	"IDENT" |
	"STRING" |
	"FUNCTION" |
	"NUMBER" |
	"HASH" |
	"PLUS" |
	"GREATER" |
	"COMMA" |
	"TILDE" |
	"NOT" |
	"ATKEYWORD" |
	"INVALID" |
	"PERCENTAGE" |
	"DIMENSION" |
	"CDO" |
	"CDC";*/

class Tokenizer<A extends string> {
	private type: A;
	private matcher: Matcher;
	private length: number;
	private counter: number;

	constructor(type: A, matcher: Matcher) {
		this.type = type;
		this.matcher = matcher;
		this.reset();
	}

	continueUpdating(): boolean {
		return this.matcher.matches() !== "n";
	}

	longestMatch(): number {
		return this.length;
	}

	produceToken(): { type: A } {
		return {
			type: this.type
		};
	}

	reset(): void {
		this.matcher.reset();
		this.length = 0;
		this.counter = 0;
	}

	updateWith(char: string): void {
		this.matcher.update(char);
		this.counter += 1;
		if (this.matcher.matches() === "y") {
			this.length = this.counter;
		}
	}
}

function tokenize<A extends string>(string: string, tokenizers: Array<Tokenizer<A>>): void {
	if (tokenizers.length === 0) {
		return;
	}
	let offset = 0;
	let current = tokenizers.slice();
	while (offset < string.length) {
		for (let i = offset; i < string.length; i++) {
			let char = string[i];
			for (let tokenizer of current) {
				tokenizer.updateWith(char);
			}
			current = current.filter((tokenizer) => tokenizer.continueUpdating());
			if (current.length === 0) {
				break;
			}
		}
		current = tokenizers.slice();
		current.sort((one, two) => {
			return two.longestMatch() - one.longestMatch();
		});
		let length = current[0].longestMatch();
		if (length === 0) {
			throw "Syntax error at offset " + offset + "!";
		}
		let token = current[0].produceToken();
		let value = string.substr(offset, length);
		offset += length;
		for (let tokenizer of current) {
			tokenizer.reset();
		}
	}
}

let tokenizers = [
	new Tokenizer("whitespace", ns.star(ns.char(" \n\r\t"))),
	new Tokenizer("{", ns.word("{")),
	new Tokenizer("}", ns.word("}")),
	new Tokenizer("[", ns.word("[")),
	new Tokenizer("]", ns.word("]")),
	new Tokenizer("string", ns.word("\"\""))
];

let t0 = process.hrtime()[1];
tokenize(`{ }`, tokenizers);
console.log(process.hrtime()[1] - t0);

let t1 = process.hrtime()[1];
JSON.parse("{ }");
console.log(process.hrtime()[1] - t1);
