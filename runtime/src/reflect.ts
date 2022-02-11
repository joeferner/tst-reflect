import { TypeBuilder }    from "./type-builder/TypeBuilder";
import { REFLECTED_TYPE } from "./consts";
import { TypeKind }       from "./enums";
import {
	Type,
	TypeActivator
}                         from "./Type";

const ArrayItemsCountToCheckItsType = 10;

/**
 * @param args
 */
function getTypeFromRuntimeValue(args: any[])
{
	const value = args[0];

	if (value === undefined) return Type.Undefined;
	if (value === null) return Type.Null;

	if (!value.constructor)
	{
		return Type.Unknown;
	}

	if (value.constructor == Array)
	{
		const set = new Set<Type>();

		// If it is an array, there can be anything; we'll check first X cuz of performance.
		for (let item of value.slice(0, ArrayItemsCountToCheckItsType))
		{
			set.add(item?.constructor?.[REFLECTED_TYPE] ?? Type.Undefined);
		}

		const valuesTypes = Array.from(set);
		const arrayBuilder = TypeBuilder.createArray();

		if (value.length == 0)
		{
			return arrayBuilder
				.setGenericType(Type.Any)
				.build();
		}

		const unionBuilder = TypeBuilder.createUnion(valuesTypes);

		// If there are more items than we checked, add Unknown type to the union.
		if (value.length > ArrayItemsCountToCheckItsType)
		{
			unionBuilder.addTypes(Type.Unknown);
		}

		return arrayBuilder.setGenericType(unionBuilder.build()).build();
	}

	return value.constructor[REFLECTED_TYPE] || Type.Unknown;
}

/**
 * Returns Type of value in memory.
 * @description Returns
 * @param value
 */
export function getType(value: any): Type
/**
 * Returns Type of generic parameter.
 */
export function getType<T>(): Type
export function getType<T>(...args: any[]): Type
{
	if (args.length)
	{
		return getTypeFromRuntimeValue(args);
	}

	if (!(((typeof window === "object" && window) || (typeof global === "object" && global) || globalThis) as any)["tst-reflect-disable"])
	{
		console.debug("[ERR] tst-reflect: You call getType() method directly. " +
			"You have probably wrong configuration, because tst-reflect-transformer package should replace this call by the Type instance.\n" +
			"If you have right configuration it may be BUG so try to create an issue.\n" +
			"If it is not an issue and you don't want to see this debug message, " +
			"create field 'tst-reflect-disable' in global object (window | global | globalThis) eg. `window['tst-reflect-disable'] = true;`");
	}

	// In case of direct call, we'll return Unknown type.
	return Type.Unknown;
}

/** @internal */
getType.__tst_reflect__ = true;

/**
 * Class decorator which marks classes to be processed and included in metadata lib file.
 * @reflectDecorator
 */
export function reflect<TType>()
{
	const typeOfTType = arguments[0]?.TType;
	
	return function <T>(Constructor: { new(...args: any[]): T }) {
		(Constructor as any)[REFLECTED_TYPE] = typeOfTType;
		return Constructor;
	};
}

reflect.__tst_reflect__ = true;


function createNativeType(typeName: string, ctor?: Function): Type
{
	const type = Reflect.construct(Type, [], TypeActivator);

	type.initialize({
		n: typeName,
		fn: typeName,
		ctor: () => ctor,
		k: TypeKind.Native
	});

	return type;
}

/**
 * List of native types
 * @description It should save some memory and all native Types will be the same instances.
 */
const nativeTypes = {
	"Object": createNativeType("Object", Object),
	"Unknown": createNativeType("unknown"),
	"Any": createNativeType("any"),
	"Void": createNativeType("void"),
	"String": createNativeType("String", String),
	"Number": createNativeType("Number", Number),
	"Boolean": createNativeType("Boolean", Boolean),
	"Date": createNativeType("Date", Date),
	"Null": createNativeType("null"),
	"Undefined": createNativeType("undefined"),
};

(Object as any)[REFLECTED_TYPE] = nativeTypes.Object;
(String as any)[REFLECTED_TYPE] = nativeTypes.String;
(Number as any)[REFLECTED_TYPE] = nativeTypes.Number;
(Boolean as any)[REFLECTED_TYPE] = nativeTypes.Boolean;
(Date as any)[REFLECTED_TYPE] = nativeTypes.Date;

/**
 * @internal
 */
export const NativeTypes = new Map<string, Type>();

for (let entry of Object.entries(nativeTypes))
{
	NativeTypes.set(entry[0].toLowerCase(), entry[1]);
}

for (const typeName in nativeTypes)
{
	if (nativeTypes.hasOwnProperty(typeName))
	{
		(Type as any)[typeName] = (nativeTypes as any)[typeName];
	}
}