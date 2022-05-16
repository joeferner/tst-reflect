import * as ts                       from "typescript";
import { Context }                   from "./contexts/Context";
import { GetTypeCall }               from "./declarations";
import { getTypeCall }               from "./getTypeCall";

export function getTypeArguments(t: ts.Node | ts.Type | ts.Symbol, context: Context): GetTypeCall[] | undefined
{
    // if we have a symbol get the type from the declaration if available
    const declaration = (t as ts.Symbol).declarations?.[0];
    const declarationType = (declaration as ts.SignatureDeclarationBase)?.type;
    if (declarationType) {
        t = declarationType;
    }

    const typeArgs: ts.Node[] | ts.Type[] | undefined = (t as any).resolvedTypeArguments ?? (t as ts.NodeWithTypeArguments).typeArguments;
	return typeArgs?.map(t => {
        const isNode = (t as any).parent;
        return getTypeCall(
            isNode ? context.typeChecker.getTypeAtLocation(t as ts.Node) : (t as ts.Type),
            isNode ? context.typeChecker.getSymbolAtLocation(t as ts.Node) : (t as ts.Type).symbol,
            context,
            undefined,
            getTypeArguments(t, context)
        );
    });
}
