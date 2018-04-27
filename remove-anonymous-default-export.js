var pascalcase = require("pascalcase");

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const { statement } = j.template;
  const root = j(file.source);

  const getDirName = ({ path }) => {
    const rawFileName = path.match(/index.jsx?$/)
      ? file.path.replace("/index.js", "").match(/[^/]+$/)[0]
      : file.path.match(/[^/]+$/)[0];
    // remove trailing extensions
    const fileName = rawFileName.match(/^[^.]+/)[0];
    return pascalcase(fileName);
  };

  const createConst = (name, declaration) => {
    return j.variableDeclaration("const", [
      j.variableDeclarator(j.identifier(name), declaration)
    ]);
  };

  root.find(j.ExportDefaultDeclaration).forEach(path => {
    if (path.value.declaration.type === "ArrowFunctionExpression") {
      const constName = getDirName(file);
      const declaration = createConst(constName, path.value.declaration);

      path.replace(declaration);
      const body = root.get().value.program.body;
      const exportDeclaration = j.exportDefaultDeclaration(
        j.identifier(constName)
      );
      body.push(exportDeclaration);
    }
  });

  return root.toSource();
};
