const React = require('react');
const renderer = require('react-test-renderer');

const EditCardDialog = require('.');

describe('EditCardDialog', () => {
  test('It renders', () => {
    const component = renderer.create(<EditCardDialog />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
