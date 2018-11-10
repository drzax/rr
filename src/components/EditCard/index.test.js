import React from "react";
import renderer from "react-test-renderer";

import Home from ".";

describe("Home", () => {
  test("It renders", () => {
    const component = renderer.create(<Home />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
