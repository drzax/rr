import React from 'react';
import renderer from 'react-test-renderer';

import GameAction from '.';

describe('GameAction', () => {
  test('It renders', () => {
    const component = renderer.create(<GameAction />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
