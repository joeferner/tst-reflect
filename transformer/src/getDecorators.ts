import * as ts                        from "typescript";
import { DecoratorDescriptionSource } from "./declarations";
import { getNodeLocationText }        from "./getNodeLocationText";
import {
	getDeclaration,
	getTypeFullName
}                                     from "./helpers";
import { log }                        from "./log";

export function getDecorators(symbol: ts.Symbol, checker: ts.TypeChecker): Array<DecoratorDescriptionSource> | undefined
{
	const declaration = getDeclaration(symbol);

	if (!declaration?.decorators)
	{
		return undefined;
	}

	const decorators: Array<DecoratorDescriptionSource> = [];

	for (let decorator of declaration.decorators)
	{
		const identifier = ts.isCallExpression(decorator.expression)
			? decorator.expression.getFirstToken()
			: ts.isIdentifier(decorator.expression)
				? decorator.expression
				: undefined;

		if (!identifier)
		{
			log.warn(`Identifier of some decorator on ${symbol.escapedName} not found.`);
			continue;
		}

		const decoratorSymbol = checker.getSymbolAtLocation(identifier);
		const decoratorDeclaration = getDeclaration(decoratorSymbol);

		if (!decoratorDeclaration)
		{
			// TODO: Log in debug mode
			continue;
		}

		let decoratorType = checker.getTypeOfSymbolAtLocation(decoratorSymbol!, decoratorDeclaration);
		let args: Array<any> = [];

		if (ts.isCallExpression(decorator.expression))
		{
			for (let arg of decorator.expression.arguments)
			{
				const type = checker.getTypeAtLocation(arg);

				if (type.isLiteral())
				{
					args.push(type.value);
				}
				else
				{


					log.warn("Unexpected decorator argument. Only constant values are allowed.\n\tAt " + getNodeLocationText(arg));
					args.push(ts.factory.createNull());
				}
			}
		}

		decorators.push({
			n: decoratorSymbol!.escapedName.toString(),
			fn: getTypeFullName(decoratorType.getSymbol()),
			args: args.length == 0 ? undefined : args
		});
	}

	return decorators.length == 0 ? undefined : decorators;
}