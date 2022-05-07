export interface JsDocDescription {
	comment?: string;
	tags?: Array<JsDocTagDescription>;
}

export type JsDocTagDescription = {
	tagName: string;
	name?: string;
	comment?: string;
};

export class JsDoc {
	/** @internal */
	private _comment?: string;
	/** @internal */
	private _tags?: ReadonlyArray<JsDocTag>;

	/**
	 * Internal JsDoc constructor
	 * @internal
	 */
	constructor(description: JsDocDescription) {
		this._comment = description.comment;
		this._tags = description.tags?.map((t) => new JsDocTag(t));
	}

	/**
	 * Returns the comment.
	 */
	get comment(): string | undefined {
		return this._comment;
	}

	/**
	 * Returns tags.
	 */
	get tags(): ReadonlyArray<JsDocTag> | undefined {
		return this._tags;
	}
}

export class JsDocTag {
	/** @internal */
	private _tagName: string;
	/** @internal */
	private _name?: string;
	/** @internal */
	private _comment?: string;

	/**
	 * Internal JsDocTag constructor
	 * @internal
	 */
	constructor(description: JsDocTagDescription) {
		this._tagName = description.tagName;
		this._name = description.name;
		this._comment = description.comment;
	}

	/**
	 * Returns the tag name.
	 */
	get tagName(): string | undefined {
		return this._tagName;
	}

	/**
	 * If this is a property like tag, for example a param tag returns the name.
	 */
	get name(): string | undefined {
		return this._name;
	}

	/**
	 * Returns the comment.
	 */
	get comment(): string | undefined {
		return this._comment;
	}
}

/**
 * @internal
 */
export class JsDocActivator extends JsDoc {}
