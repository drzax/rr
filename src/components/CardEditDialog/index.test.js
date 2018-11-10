import React from "react";
import renderer from "react-test-renderer";

import CardEditDialog from ".";

describe("CardEditDialog", () => {
  test("It renders", () => {
    const component = renderer.create(<CardEditDialog />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
