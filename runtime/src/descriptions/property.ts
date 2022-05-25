import {
	AccessModifier,
	Accessor,
	TypeKind
}                          from "../enums";
import {
	Mapper,
	resolveLazyType
}                          from "../mapper";
import type { Type }       from "../Type";
import {
	Decorator,
	DecoratorDescription
}                          from "./decorator";
import {
	JsDoc,
	JsDocDescription
}                          from "./js-doc";

/**
 * @internal
 */
export interface PropertyDescription
{
	/**
	 * Name of the property
	 */
	n: string;

	/**
	 * Property type
	 */
	t: Type | (() => Type);

	/**
	 * Optional property
	 */
	o: boolean;

	/**
	 * Decorators
	 */
	d?: Array<DecoratorDescription>;

	/**
	 * Access modifier
	 */
	am?: AccessModifier;

	/**
	 * Accessor
	 */
	acs?: Accessor;

	/**
	 * Readonly
	 */
	ro?: boolean;

	/**
	 * Kind
	 */
	k?: TypeKind;

	/**
	 * jsDocs if present
	 */
	jsDocs?: Array<JsDocDescription>;
}

/**
 * Property description
 */
export class Property
{
	/**
	 * Property decorators
	 * @internal
	 */
	private _decorators: ReadonlyArray<Decorator>;
	
	/**
	 * Property name
	 */
	readonly name: string;

	/**
	 * Property type
	 */
	private readonly _type: Type | (() => Type);
	private _resolvedType?: Type;

	/**
	 * Optional property
	 */
	readonly optional: boolean;

	/**
	 * Access modifier
	 */
	readonly accessModifier: AccessModifier;

	/**
	 * Accessor
	 */
	readonly accessor: Accessor;

	/**
	 * Readonly
	 */
	readonly readonly: boolean;

	/**
	 * Kind
	 */
	readonly kind?: TypeKind;

	/**
	 * jsDocs if present
	 */
	readonly jsDocs?: ReadonlyArray<JsDoc>;

	/**
	 * @param description
	 * @internal
	 */
	protected constructor(description: PropertyDescription)
	{
		this.name = description.n;
		this.kind = description.k;
		this._type = description.t;
		this._decorators = description.d?.map(Mapper.mapDecorators) || [];
		this.optional = description.o;
		this.accessModifier = description.am ?? AccessModifier.Public;
		this.accessor = description.acs ?? Accessor.None;
		this.readonly = description.ro ?? false;
		this.jsDocs = description.jsDocs?.map(Mapper.mapJsDocs);
	}
	
	/**
	 * Returns array of decorators
	 */
	getDecorators(): ReadonlyArray<Decorator>
	{
		return this._decorators.slice();
	}

	get type(): Type
	{
		if (!this._resolvedType)
		{
			this._resolvedType = resolveLazyType(this._type);
		}
		return this._resolvedType;
	}
}

/**
 * @internal
 */
export class PropertyActivator extends Property
{
}