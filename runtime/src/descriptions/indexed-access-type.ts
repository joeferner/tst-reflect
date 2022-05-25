import type { Type } from "../Type";

/**
 * @internal
 */
export interface IndexedAccessTypeDescription
{
	/**
	 * Object type
	 */
	ot: Type | (() => Type);

	/**
	 * Index type
	 */
	it: Type | (() => Type);
}

export interface IndexedAccessType
{
	/**
	 * Object type
	 */
	objectType: Type;

	/**
	 * Index type
	 */
	indexType: Type;
}
