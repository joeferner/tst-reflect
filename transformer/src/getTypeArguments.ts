import * as ts                       from "typescript";
import { Context }                   from "./contexts/Context";
import { GetTypeCall }               from "./declarations";
import { getTypeCall }               from "./getTypeCall";

export function getTypeArguments(node: ts.Node | ts.Type | ts.Symbol, context: Context): GetTypeCall[] | undefined
{
    if ((node as ts.Symbol).declarations?.[0]) {
        const declaration = (node as ts.Symbol).declarations?.[0];
        if ((declaration as any)?.type) {
            node = (declaration as any)?.type;
        }
    }
	const typeArgs: ts.Node[] | ts.Type[] | undefined = (node as any).resolvedTypeArguments ?? (node as any).typeArguments;
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
