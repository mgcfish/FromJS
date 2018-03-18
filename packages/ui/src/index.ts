import babelPlugin from "../../babel-plugin-data-flow";
// import Babel from "@babel/standalone";
// document.write("hi");

const codeTextarea = <HTMLInputElement>document.querySelector("#code");
codeTextarea.addEventListener("keyup", function(e) {
  setTimeout(function() {
    try {
      showResult();
    } catch (err) {
      console.error(err);
    }
  });
});

const compiledCodeTextarea = <HTMLInputElement>document.querySelector(
  "#compiled-code"
);

showResult();

function showResult() {
  var code = codeTextarea.value;
  var res = window["Babel"].transform(code, {
    plugins: [babelPlugin]
  });
  code = res.code;
  compiledCodeTextarea.value = res.code.split("/* HELPER_FUNCTIONS_END */ ")[1];
  eval(code);
  console.log(window["x"]);

  document.querySelector("#basic-example").innerHTML = "";

  var data = window["x"].tracking; //.argTrackingValues[0].argTrackingValues[0];
  var config = {
    container: "#basic-example",

    connectors: {
      type: "step"
    },
    node: {
      HTMLclass: "nodeExample1"
    }
  };

  var nodeStructure;

  function makeNode(data) {
    var childValues;
    if (data) {
      childValues = data.argTrackingValues.map((child, i) => {
        console.log(child);
        if (child === null || child === undefined) {
          return;
        }
        if (
          child.type === "identifier" ||
          child.type === "functionReturnValue"
        ) {
          // skip it because it's not very interesting
          return child.argTrackingValues[0];
        } else {
          return child;
        }
      });
    } else {
      childValues = [];
    }

    var children = childValues.map(makeNode);

    var type;
    if (data) {
      type = data.type;
    } else {
      type = "(" + data + ")";
    }

    var resVal;
    if (data) {
      resVal =
        data.type === "functionArgument"
          ? data.argValues[0] + ""
          : data.resVal || "";
    } else {
      resVal = "todo..";
    }

    var name = type + " -> " + resVal;
    var extra = data
      ? data.type === "functionArgument" ? data.fnToString.slice(0, 20) : "-"
      : "";
    return {
      innerHTML: `<div>
        <b>${name}</b>
        <div>${extra}</div>
      </div>`,

      children: children
    };
  }

  nodeStructure = makeNode(data);

  var chart_config = {
    chart: {
      container: "#basic-example",

      connectors: {
        type: "step"
      },
      node: {
        HTMLclass: "nodeExample1"
      }
    },
    nodeStructure: nodeStructure
  };

  new window["Treant"](chart_config);
}

window["showResult"] = showResult;
