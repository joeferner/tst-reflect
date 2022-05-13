import {
	getType,
	Type
} from "tst-reflect";

test("It is possible to get type of generic type parameter.", () => {
	function infer<T>(): Type
	{
		return getType<T>();
	}

	class A
	{
	}

	expect(infer<A>() instanceof Type).toBe(true);
	expect(infer<A>()).not.toBe(Type.Unknown);
});

test("Get generic type arguments from arrays.", () => {
	interface MyObject {
		numberArray: Array<number>;
		stringArray: ReadonlyArray<string>;
	}

	const t = getType<MyObject>();

	const aNumberArrayProp = t.getProperties().find(p => p.name === 'numberArray')!;
	expect(aNumberArrayProp.type.isArray()).toBeTruthy();
	expect(aNumberArrayProp.type.getTypeArguments()).toHaveLength(1);
	expect(aNumberArrayProp.type.getTypeArguments()![0].name).toBe('Number');

	const aStringArrayProp = t.getProperties().find(p => p.name === 'stringArray')!;
	expect(aStringArrayProp.type.isArray()).toBeTruthy();
	expect(aStringArrayProp.type.getTypeArguments()).toHaveLength(1);
	expect(aStringArrayProp.type.getTypeArguments()![0].name).toBe('String');
});

test("Get generic type parameter from interface property.", () => {
	interface A<T>
	{
		a: T;
	}

	interface B {
		aNonGeneric: number;
		aNumber: A<number>;
		aString: Partial<A<string>>;
	}

	const t = getType<B>();

	const aNonGenericProp = t.getProperties().find(p => p.name === 'aNonGeneric')!;
	expect(aNonGenericProp.type.name).toBe('Number');
	expect(aNonGenericProp.type.getTypeArguments()).toStrictEqual([]);

	const aNumberProp = t.getProperties().find(p => p.name === 'aNumber')!;
	expect(aNumberProp.type.name).toBe('A');
	expect(aNumberProp.type.getTypeArguments()).toHaveLength(1);
	expect(aNumberProp.type.getTypeArguments()![0]!.name).toBe("Number");

	const aStringProp = t.getProperties().find(p => p.name === 'aString')!;
	expect(aStringProp.type.name).toBe('Partial');
	expect(aStringProp.type.getTypeArguments()).toHaveLength(1);
	const aA = aStringProp.type.getTypeArguments()![0]!;
	expect(aA.name).toBe("A");
	expect(aA.getTypeArguments()).toHaveLength(1);
	expect(aA.getTypeArguments()![0]!.name).toBe("String");
});

test("Get generic type arguments from base type.", () => {
	interface A<T>
	{
		a: T;
	}

	interface B extends A<number> {
	}

	const t = getType<B>();
	expect(t.baseType?.getTypeArguments()).toHaveLength(1);
	expect(t.baseType?.getTypeArguments()![0].name).toBe('Number');
});

test("Get generic type arguments from base type, multi-level.", () => {
	interface A<T>
	{
		a: T;
	}

	interface B extends Partial<A<number>> {
	}

	const t = getType<B>();
	expect(t.baseType?.name).toBe("Partial");
	expect(t.baseType?.getTypeArguments()).toHaveLength(1);
	const tA = t.baseType?.getTypeArguments()![0]!;
	expect(tA.name).toBe('A');
	expect(tA.getTypeArguments()).toHaveLength(1);
	const tNumber = tA.getTypeArguments()![0]!;
	expect(tNumber.name).toBe('Number');
});
