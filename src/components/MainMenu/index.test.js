const React = require("react");
const renderer = require("react-test-renderer");

const MainMenu = require("./component");

describe("MainMenu", () => {
  test("It renders", () => {
    const component = renderer.create(<MainMenu username="Test" />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
