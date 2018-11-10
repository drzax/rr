const React = require("react");
const renderer = require("react-test-renderer");

const LoginButtonEmail = require(".");

describe("LoginButtonEmail", () => {
  test("It renders", () => {
    const component = renderer.create(<LoginButtonEmail />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
