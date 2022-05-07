import {
	getType
} from "tst-reflect";

test("getType<T>() gets jsDocs of class and properties", () => {
	/**
	 * This is class ObjectWithJsDocs.
	 */
	class ObjectWithJsDocs
	{
		/**
		 * This is a number property.
		 */
		propA: number = 0;

		/**
		 * This is a constructor.
		 */
		constructor() {}

		/**
		 * This is a method.
		 * 
		 * @param a is a number
		 * @param b is a string
		 */
		methodA(a: number, b: string): void {}
	}

	const t = getType<ObjectWithJsDocs>();
	expect(t.jsDocs).toHaveLength(1);
	expect(t.jsDocs![0].comment).toBe('This is class ObjectWithJsDocs.');

	const prop = t.getProperties().filter(p => p.name === 'propA')[0]!;
	expect(prop.jsDocs).toHaveLength(1);
	expect(prop.jsDocs![0].comment).toBe('This is a number property.');
	
	const con = t.getConstructors()![0]!;
	expect(con.jsDocs).toHaveLength(1);
	expect(con.jsDocs![0].comment).toBe('This is a constructor.');

	const fn = t.getMethods().filter(m => m.name === 'methodA')[0]!;
	expect(fn.jsDocs).toHaveLength(1);
	expect(fn.jsDocs![0].comment).toBe('This is a method.');
	expect(fn.jsDocs![0].tags).toHaveLength(2);
	expect(fn.jsDocs![0].tags?.[0].tagName).toBe('param');
	expect(fn.jsDocs![0].tags?.[0].name).toBe('a');
	expect(fn.jsDocs![0].tags?.[0].comment).toBe('is a number');
	expect(fn.jsDocs![0].tags?.[1].tagName).toBe('param');
	expect(fn.jsDocs![0].tags?.[1].name).toBe('b');
	expect(fn.jsDocs![0].tags?.[1].comment).toBe('is a string');
});

test("getType<T>() gets jsDocs of interface and properties", () => {
	/**
	 * This is class InterfaceWithJsDocs.
	 */
	interface InterfaceWithJsDocs
	{
		/**
		 * This is a number property.
		 */
		propA: number;

		/**
		 * This is a method.
		 */
		 methodA(): void;
	}

	const t = getType<InterfaceWithJsDocs>();
	expect(t.jsDocs).toHaveLength(1);
	expect(t.jsDocs![0].comment).toBe('This is class InterfaceWithJsDocs.');
	const prop = t.getProperties().filter(p => p.name === 'propA')[0]!;
	expect(prop.jsDocs).toHaveLength(1);
	expect(prop.jsDocs![0].comment).toBe('This is a number property.');
	const fn = t.getMethods().filter(m => m.name === 'methodA')[0]!;
	expect(fn.jsDocs).toHaveLength(1);
	expect(fn.jsDocs![0].comment).toBe('This is a method.');
});

test("getType<T>() gets jsDocs with annotation", () => {
	/**
	 * @comment This is class InterfaceWithJsDocs.
	 */
	interface InterfaceWithJsDocs
	{
		/**
		 * @comment This is a number property.
		 */
		 propA: number;
	}

	const t = getType<InterfaceWithJsDocs>();
	expect(t.jsDocs).toHaveLength(1);
	const jsDoc = t.jsDocs![0];
	expect(jsDoc.comment).toBeUndefined();
	expect(jsDoc.tags).toHaveLength(1);
	expect(jsDoc.tags![0].tagName).toBe('comment');
	expect(jsDoc.tags![0].comment).toBe('This is class InterfaceWithJsDocs.');

	const prop = t.getProperties().filter(p => p.name === 'propA')[0]!;
	expect(prop.jsDocs).toHaveLength(1);
	expect(prop.jsDocs?.[0]?.tags).toHaveLength(1);
	expect(prop.jsDocs?.[0]?.tags![0].tagName).toBe('comment');
	expect(prop.jsDocs?.[0]?.tags![0].comment).toBe('This is a number property.');
});
