function $(...values: any): string {
	return Array.of(...values)
		.map((value) => {
			return String(value);
		}).join("");
}

export {
	$
};
