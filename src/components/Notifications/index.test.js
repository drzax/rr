import React from "react";
import renderer from "react-test-renderer";

import { Notifications } from ".";

describe("Notification", () => {
  test("It renders", () => {
    const message = "Test notification";
    const component = renderer.create(
      <Notifications
        isOpen={true}
        onClose={() => {}}
        autoHideDuration={1000}
        message={message}
      />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
