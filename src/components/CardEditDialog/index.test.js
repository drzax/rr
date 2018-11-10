const React = require('react');
const renderer = require('react-test-renderer');

const CardEditDialog = require('.');

describe('CardEditDialog', () => {
  test('It renders', () => {
    const component = renderer.create(<CardEditDialog />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
