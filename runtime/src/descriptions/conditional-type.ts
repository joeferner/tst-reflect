import type { Type } from "../Type";

/**
 * @internal
 */
export interface ConditionalTypeDescription
{
	/**
	 * Extends type
	 */
	e: Type | (() => Type);

	/**
	 * True type
	 */
	tt: Type | (() => Type);

	/**
	 * False type
	 */
	ft: Type | (() => Type);
}

export interface ConditionalType
{
	/**
	 * Extends type
	 */
	extends: Type;

	/**
	 * True type
	 */
	trueType: Type;

	/**
	 * False type
	 */
	falseType: Type;
}
