import React from "react";
import renderer from "react-test-renderer";

import CardSaveButton from ".";

describe("CardSaveButton", () => {
  test("It renders", () => {
    const component = renderer.create(<CardSaveButton />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
