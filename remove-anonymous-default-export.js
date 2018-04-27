var pascalcase = require("pascalcase");

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const { statement } = j.template;
  const root = j(file.source);

  const getDirName = ({ path }) => {
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
    if (path.value.declaration.type === "ArrowFunctionExpression") {
      const constName = getDirName(file);
      const declaration = createFunction(constName, path.value.declaration);
      path.value.declaration = declaration;
    }
  });

  return root.toSource();
};
