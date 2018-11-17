import React from 'react';
import renderer from 'react-test-renderer';

import GameStartButton from '.';

describe('GameStartButton', () => {
  test('It renders', () => {
    const component = renderer.create(<GameStartButton />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
