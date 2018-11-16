const React = require('react');
const renderer = require('react-test-renderer');

const Root = require('.');

describe('Root', () => {
  test('It renders', () => {
    const component = renderer.create(<Root />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
