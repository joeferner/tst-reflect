import {
	getType,
	Type,
	TypeKind
} from "tst-reflect";

test("getType<T>() is transformed and it is not Type.Unknown", () => {
	class A
	{
	}

	expect(getType<A>() instanceof Type).toBe(true);
	expect(getType<A>()).not.toBe(Type.Unknown);
	expect(getType<A>().name).toBe("A");
});

test("getType<T>() returns correct type", () => {
	// Array is Array
	expect(getType<string[]>().is(getType<string[]>())).toBe(true);
	expect(getType<string[]>().is(getType<number[]>())).toBe(true);
	
	expect(
		getType<Array<string>>().is(getType<string[]>())
	).toBe(true);
	
	expect(
		getType<string[]>().getTypeArguments()[0].is(getType<string[]>().getTypeArguments()[0])
	).toBe(true);
	
	expect(
		getType<string[]>().getTypeArguments()[0]
	).toBe(getType<string[]>().getTypeArguments()[0]);
	
	expect(
		getType<string[]>().getTypeArguments()[0].is(getType<number[]>().getTypeArguments()[0])
	).toBe(false);
});

test("getType<T>() tuple", () => {
	type A = [string, number];

	const t = getType<A>();
	expect(t.name).toBe('A');
	expect(t.isArray()).toBeTruthy();
	const props = t.getProperties();
	expect(props).toHaveLength(2);
	expect(props[0].type.name).toBe('String');
	expect(props[1].type.name).toBe('Number');
});

test("getType<T>() tuple, variable length", () => {
	type A = [string, ...string[]];

	const t = getType<A>();
	expect(t.name).toBe('A');
	expect(t.isArray()).toBeTruthy();
	const props = t.getProperties();
	expect(props).toHaveLength(2);
	expect(props[0].type.name).toBe('String');
	expect(props[1].type.name).toBe('String');
	expect(props[1].kind).toBe(TypeKind.RestType);
});
