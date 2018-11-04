const React = require('react');
const renderer = require('react-test-renderer');

const Game = require('.');

describe('Game', () => {
  test('It renders', () => {
    const component = renderer.create(<Game />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
