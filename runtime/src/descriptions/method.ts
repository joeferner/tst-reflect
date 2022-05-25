import { AccessModifier } from "../enums";
import {
	Mapper,
	resolveLazyType,
	resolveLazyTypes
}                         from "../mapper";
import type { Type }      from "../Type";
import {
	Decorator,
	DecoratorDescription
}                         from "./decorator";
import {
	JsDoc,
	JsDocDescription
}                         from "./js-doc";
import {
	MethodParameter,
	ParameterDescription
}                         from "./parameter";

/**
 * @internal
 */
export interface MethodDescription
{
	/**
	 * Method name
	 */
	n: string;

	/**
	 * Parameters
	 */
	params: Array<ParameterDescription>;

	/**
	 * Return type
	 */
	rt: Type | (() => Type);

	/**
	 * Decorators
	 */
	d?: Array<DecoratorDescription>;

	/**
	 * Generic type parameters
	 */
	tp?: Array<Type | (() => Type)>;

	/**
	 * Optional method
	 */
	o: boolean;

	/**
	 * Access modifier
	 */
	am: AccessModifier;

	/**
	 * jsDocs if present
	 */
	jsDocs?: Array<JsDocDescription>;
}

export abstract class MethodBase
{
	private readonly _parameters: Array<ParameterDescription>;
	private _resolvedParameters?: Array<MethodParameter>;
	private readonly _jsDocs: Array<JsDoc> | undefined;

	/**
	 * Internal constructor
	 * @internal
	 */
	protected constructor(params: Array<ParameterDescription>, jsDocs: Array<JsDocDescription> | undefined)
	{
		this._parameters = params || [];
		this._jsDocs = jsDocs?.map(Mapper.mapJsDocs);
	}

	/**
	 * Parameters of this method
	 */
	getParameters(): ReadonlyArray<MethodParameter>
	{
		if (!this._resolvedParameters)
		{
			this._resolvedParameters = this._parameters.map(p => {
				let type = p.t;
				if (typeof type === 'function')
				{
					type = type();
				}
				return {
					name: p.n,
					type,
					optional: p.o
				};
			});
		}
		return this._resolvedParameters.slice();
	}

	/**
	 * jsDocs if present
	 */
	get jsDocs(): JsDoc[] | undefined
	{
		return this._jsDocs;
	}
}

/**
 * Method details
 */
export class Method extends MethodBase
{
	private readonly _name: string;
	private readonly _returnType: Type | (() => Type);
	private _resolvedReturnType?: Type;
	private readonly _optional: boolean;
	private readonly _typeParameters: Array<Type | (() => Type)>;
	private _resolvedTypeParameters?: Array<Type>;
	private readonly _decorators: Array<Decorator>;
	private readonly _accessModifier: AccessModifier;

	/**
	 * Name of this method
	 */
	get name(): string
	{
		return this._name;
	}

	/**
	 * Return type of this method
	 */
	get returnType(): Type
	{
		if (!this._resolvedReturnType)
		{
			this._resolvedReturnType = resolveLazyType(this._returnType);
		}
		return this._resolvedReturnType;
	}

	/**
	 * Method is optional
	 */
	get optional(): boolean
	{
		return this._optional;
	}

	/**
	 * Access modifier
	 */
	get accessModifier(): AccessModifier
	{
		return this._accessModifier;
	}

	/**
	 * Internal method constructor
	 * @internal
	 */
	constructor(description: MethodDescription)
	{
		super(description.params, description.jsDocs);

		if (new.target != MethodActivator)
		{
			throw new Error("You cannot create instance of Method manually!");
		}

		this._name = description.n;
		this._typeParameters = description.tp || [];
		this._returnType = description.rt;
		this._optional = description.o;
		this._accessModifier = description.am;
		this._decorators = description.d?.map(Mapper.mapDecorators) || [];
	}

	/**
	 * Returns list of generic type parameter.
	 * @return {Array<Type>}
	 */
	getTypeParameters(): ReadonlyArray<Type>
	{
		if (!this._resolvedTypeParameters)
		{
			this._resolvedTypeParameters = resolveLazyTypes(this._typeParameters);
		}
		return this._resolvedTypeParameters.slice();
	}

	/**
	 * Returns array of decorators
	 */
	getDecorators(): ReadonlyArray<Decorator>
	{
		return this._decorators.slice();
	}
}

/**
 * @internal
 */
export class MethodActivator extends Method
{
}

/**
 * @internal
 */
export interface ConstructorDescription
{
	params: Array<ParameterDescription>;

	/**
	 * jsDocs if present
	 */
	jsDocs?: Array<JsDocDescription>;
}

/**
 * Constructor details
 */
export class Constructor extends MethodBase
{
	/**
	 * Internal constructor
	 * @internal
	 */
	constructor(description: ConstructorDescription)
	{
		super(description.params, description.jsDocs);

		if (new.target != ConstructorActivator)
		{
			throw new Error("You cannot create instance of Constructor manually!");
		}
	}
}

/**
 * @internal
 */
export class ConstructorActivator extends Constructor
{
}
