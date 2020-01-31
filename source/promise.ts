interface Callback<A> {
	(value: A): void
}

interface ChainableLike<A> {
	catch(callback: Callback<Error>): ChainableLike<A>;
	finally(callback: Callback<void>): ChainableLike<A>;
	then(callback: Callback<A>): ChainableLike<A>;
}

interface Settler<A> {
	(resolve: Callback<A>, reject: Callback<Error>): void;
}

class Chainable<A> {
	constructor(settler: Settler<A>) {

	}

	static reject<A>(error: Error): Chainable<A> {
		return new Chainable<A>((resolve, reject) => reject(error));
	}

	static resolve<A>(value: A): Chainable<A> {
		return new Chainable<A>((resolve, reject) => resolve(value));
	}
}

new Chainable<string>((resolve, reject) => {
	resolve("hej");
}).then((string) => {
	console.log("success " + string);
}).catch((error) => {
	console.log("failure " + error);
}).finally(() => {

});
