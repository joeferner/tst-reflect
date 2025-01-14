import * as ts                                            from "typescript";
import { Context }                                        from "./contexts/Context";
import { FunctionLikeDeclarationGenericParametersDetail } from "./FunctionLikeDeclarationGenericParametersDetail";
import { getGenericParametersDetails }                    from "./getGenericParametersDetails";
import { getTypeCall }                                    from "./getTypeCall";
import {
	getDeclaration,
	ignoreNode
}                                                         from "./helpers";
import { updateCallExpression }                           from "./updateCallExpression";

export function processDecorator(node: ts.Decorator, decoratorType: ts.Type, context: Context): ts.Decorator | undefined
{
	// Method/function declaration
	const declaration = getDeclaration(decoratorType.symbol) as ts.FunctionLikeDeclarationBase;

	if (!declaration)
	{
		return undefined;
	}

	// Try to get State
	const state: FunctionLikeDeclarationGenericParametersDetail = getGenericParametersDetails(declaration, context, []);

	// Type of Class
	let genericTypeNode: ts.NamedDeclaration, genericType: ts.Type;

	if (ts.isPropertyDeclaration(node.parent) || ts.isMethodDeclaration(node.parent))
	{
		genericTypeNode = node.parent.parent;
		genericType = context.typeChecker.getTypeAtLocation(genericTypeNode);
	}
	else
	{
		genericTypeNode = node.parent;
		genericType = context.typeChecker.getTypeAtLocation(genericTypeNode);
	}

	const genericTypeSymbol = genericType.getSymbol();

	if (!state || !state.usedGenericParameters || !state.indexesOfGenericParameters || !state.requestedGenericsReflection)
	{
		// Decorator does not accept generic type argument but processDecorator was 
		// forced by @reflect, so we'll generate metadata and keep decorator as is.
		getTypeCall(
			genericType,
			genericTypeSymbol,
			context,
			genericTypeNode.name
		);
		
		return undefined;
	}

	// Decorator has no generic parameters in nature; we just abusing it so only one generic parameter makes sense
	const genericParamName = state.usedGenericParameters[0];

	let callExpression: ts.CallExpression;
	const typeArgumentDescription = {
		genericTypeName: genericParamName,
		reflectedType: getTypeCall(
			genericType,
			genericTypeSymbol,
			context,
			genericTypeNode.name
		)
	};

	if (ts.isCallExpression(node.expression))
	{
		callExpression = updateCallExpression(node.expression, state, [typeArgumentDescription]);
	}
	else if (ts.isIdentifier(node.expression))
	{
		callExpression = createCallExpressionFromIdentifier(context, node, typeArgumentDescription);
	}
	else
	{
		return undefined;
	}

	// Mark expression as ignored for further processing
	ignoreNode(callExpression);

	return ts.factory.updateDecorator(node, callExpression);
}

function createCallExpressionFromIdentifier(context: Context, node: ts.Decorator, typeArgumentDescription: { reflectedType: ts.CallExpression; genericTypeName: string })
{
	const args = [];
	const declaration = getDeclaration(context.typeChecker.getSymbolAtLocation(node.expression));

	if (declaration && (ts.isFunctionDeclaration(declaration)))
	{
		for (let param of declaration.parameters)
		{
			args.push(ts.factory.createIdentifier("undefined"));
		}
	}

	return ts.factory.createCallExpression(node.expression, undefined, [
		...args,
		ts.factory.createObjectLiteralExpression([ts.factory.createPropertyAssignment(
			typeArgumentDescription.genericTypeName,
			typeArgumentDescription.reflectedType
		)])
	]);
}