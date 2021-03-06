export const binaryExpression = "binaryExpression";
export const numericLiteral = "numericLiteral";
export const stringLiteral = "stringLiteral";
export const identifier = "identifier";
export const returnStatement = "returnStatement";
export const memberExpression = "memberExpression";
export const objectExpression = "objectExpression";
export const functionArgument = "functionArgument";
export const callExpression = "callExpression";
export const newExpression = "newExpression";
export const assignmentExpression = "assignmentExpression";
export const arrayExpression = "arrayExpression";
export const conditionalExpression = "conditionalExpression";
export const stringReplacement = "stringReplacement";
export const jsonParseResult = "jsonParseResult";
export const newExpressionResult = "newExpressionResult";
export const defaultArrayJoinSeparator = "defaultArrayJoinSeparator";
export const untrackedValue = "untrackedValue";
export const arrayIndex = "arrayIndex";
export const objectProperty = "objectProperty";
export const unaryExpression = "unaryExpression";
export const memexpAsLeftAssExp = "memexpAsLeftAssExp";
export const fetchResponse = "fetchResponse";
export const splitResult = "splitResult";
// These ones are kind of bad... think about if there's a better way to model this.
// They exist because if I do `["a", "b"].slice(1,2)` I want the slice call to be part
// of the history of "b"... although technically the slice is part of the array history
export const objectAssign = "objectAssign";
export const arraySlice = "arraySlice";
export const arrayConcat = "arrayConcat";
export const matchResult = "matchResult";
