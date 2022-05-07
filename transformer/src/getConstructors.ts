import * as ts                          from "typescript";
import { ConstructorDescriptionSource } from "./declarations";
import { getSignatureParameters }       from "./getSignatureParameters";
import { Context }                      from "./contexts/Context";
import { getJsDocs }                    from "./helpers";

export function getConstructors(type: ts.Type, context: Context)
{
	const constructors: Array<ConstructorDescriptionSource> = [];
	const ctors = type.getConstructSignatures();

	for (let ctorSignature of ctors)
	{
		constructors.push({
			params: getSignatureParameters(ctorSignature, context),
			jsDocs: getJsDocs(ctorSignature.declaration, context),
		});
	}

	return constructors.length ? constructors : undefined;
}
