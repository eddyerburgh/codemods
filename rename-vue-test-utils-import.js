const isVueTestUtilsImport = p => p.value.source.value === "vue-test-utils";

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const { statement } = j.template;
  const root = j(file.source);

  root.find(j.ImportDeclaration).forEach(path => {
    if (isVueTestUtilsImport(path)) {
      path.value.source.value = "@vue/test-utils";
    }
  });

  return root.toSource({ quote: "single" });
};
