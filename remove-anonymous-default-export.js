var pascalcase = require("pascalcase");

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const { statement } = j.template;
  const root = j(file.source);

  const getFunctionName = ({ path }) => {
    const rawFileName = path.match(/index./)
      ? file.path.replace(/\/index/, "").match(/[^/]+$/)[0]
      : file.path.match(/[^/]+$/)[0];
    // remove extensions
    const fileName = rawFileName.match(/^[^.]+/)[0];
    return pascalcase(fileName);
  };

  const createFunction = (name, declaration) => {
    const body =
      declaration.body.type !== "BlockStatement"
        ? j.blockStatement([j.returnStatement(declaration.body)])
        : declaration.body;

    return j.functionDeclaration(j.identifier(name), declaration.params, body);
  };

  root.find(j.ExportDefaultDeclaration).forEach(path => {
    const constName = getFunctionName(file);
    if (path.value.declaration.type === "ArrowFunctionExpression") {
      const declaration = createFunction(constName, path.value.declaration);
      path.value.declaration = declaration;
    }
    if (path.value.declaration.type === "FunctionDeclaration") {
      path.value.declaration.id = constName;
    }
  });

  return root.toSource();
};
