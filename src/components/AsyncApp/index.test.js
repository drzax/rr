import React from "react";
import renderer from "react-test-renderer";
import { AsyncApp } from ".";

describe("AsyncApp", () => {
  test("It renders", () => {
    const component = renderer.create(<App userChecked={false} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
