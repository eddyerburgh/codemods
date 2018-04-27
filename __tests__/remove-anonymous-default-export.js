const defineTest = require("jscodeshift/dist/testUtils").defineTest;
defineTest(__dirname, "remove-anonymous-default-export");
defineTest(
  __dirname,
  "remove-anonymous-default-export",
  null,
  "/anonymous-export/index"
);
defineTest(
  __dirname,
  "remove-anonymous-default-export",
  null,
  "/anonymous-export/test"
);
