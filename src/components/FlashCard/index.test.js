const React = require('react');
const renderer = require('react-test-renderer');

const Card = require('.');

describe('Card', () => {
  test('It renders', () => {
    const component = renderer.create(<Card />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
