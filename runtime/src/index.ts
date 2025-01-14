export * from "./consts";
export * from "./enums";
export * from "./meta-stores";
export * from "./descriptions/decorator";
export * from "./descriptions/parameter";
export * from "./descriptions/property";
export * from "./descriptions/method";
export * from "./descriptions/conditional-type";
export * from "./descriptions/indexed-access-type";
export * from "./descriptions/constructor-import";
export * from "./descriptions/enum-info";
export * from "./descriptions/type-properties";
export * from "./Type";
export * from "./reflect";

import { setTypeBuilder } from "./flatten";
import { TypeBuilder }    from "./type-builder/TypeBuilder";

setTypeBuilder(TypeBuilder);