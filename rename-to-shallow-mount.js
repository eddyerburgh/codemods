const isVueTestUtilsImport = p => p.value.source.value === "@vue/test-utils";
const isShallowNamedFn = p => p.value.callee.name === "shallow";

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const { statement } = j.template;
  const root = j(file.source);

  root.find(j.ImportDeclaration).forEach(path => {
    if (isVueTestUtilsImport(path)) {
      path.value.specifiers.forEach(s => {
        if (s.imported.name === "shallow") {
          s.imported.name = "shallowMount";
        }
      });
    }
  });

  root.find(j.CallExpression).forEach(path => {
    if (isShallowNamedFn(path)) {
      path.value.callee.name = "shallowMount";
    }
  });

  return root.toSource();
};
