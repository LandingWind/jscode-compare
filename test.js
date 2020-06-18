import parseCodeToAST from './dist/generateAST'

(async () => {
    const astResult = await parseCodeToAST('./demo.js');
    console.log(astResult);
})()

console.log(typeof parseCodeToAST);
