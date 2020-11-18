function getStaticPropertyName(node) {
  let prop;

  switch (node && node.type) {
      case "ChainExpression":
          return getStaticPropertyName(node.expression);

      case "Property":
      case "MethodDefinition":
          prop = node.key;
          break;

      case "MemberExpression":
          prop = node.property;
          break;

          // no default
  }

  if (prop) {
      if (prop.type === "Identifier" && !node.computed) {
          return prop.name;
      }

      return getStaticStringValue(prop);
  }

  return null;
}

function getFunctionNameWithKind(node) {
  const parent = node.parent;
  const tokens = [];

  if (parent.type === "MethodDefinition" && parent.static) {
      tokens.push("static");
  }
  if (node.async) {
      tokens.push("async");
  }
  if (node.generator) {
      tokens.push("generator");
  }

  if (node.type === "ArrowFunctionExpression") {
      tokens.push("arrow", "function");
  } else if (parent.type === "Property" || parent.type === "MethodDefinition") {
      if (parent.kind === "constructor") {
          return "constructor";
      }
      if (parent.kind === "get") {
          tokens.push("getter");
      } else if (parent.kind === "set") {
          tokens.push("setter");
      } else {
          tokens.push("method");
      }
  } else {
      tokens.push("function");
  }

  if (node.id) {
      tokens.push(`'${node.id.name}'`);
  } else {
      const name = getStaticPropertyName(parent);

      if (name !== null) {
          tokens.push(`'${name}'`);
      }
  }

  return tokens.join(" ");
}

module.exports = getFunctionNameWithKind;