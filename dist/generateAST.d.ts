declare function parseCodeToAST(inputModule: string): Promise<import("@babel/types").File>;
export default parseCodeToAST;
