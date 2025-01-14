import { MethodDescription }        from "../descriptions/method";
import { PropertyDescription }      from "../descriptions/property";
import type { Type }                from "../Type";
import { ArrayTypeBuilder }         from "./ArrayBuilder";
import { IntersectionTypeBuilder }  from "./IntersectionTypeBuilder";
import { MethodBuilder }            from "./MethodBuilder";
import { ObjectLiteralTypeBuilder } from "./ObjectLiteralTypeBuilder";
import { PropertyBuilder }          from "./PropertyBuilder";
import { UnionTypeBuilder }         from "./UnionTypeBuilder";

export class TypeBuilder
{
	private constructor()
	{
	}

	static createUnion(types: Type[]): UnionTypeBuilder
	{
		return new UnionTypeBuilder().addTypes(...types);
	}

	static createIntersection(types: Type[]): IntersectionTypeBuilder
	{
		return new IntersectionTypeBuilder().addTypes(...types);
	}

	static createArray(): ArrayTypeBuilder
	{
		return new ArrayTypeBuilder();
	}

	static createObject(): ObjectLiteralTypeBuilder
	{
		return new ObjectLiteralTypeBuilder();
	}

	static createProperty(description: PropertyDescription): PropertyBuilder
	{
		return new PropertyBuilder(description);
	}

	static createMethod(description: MethodDescription): MethodBuilder
	{
		return new MethodBuilder(description);
	}
}