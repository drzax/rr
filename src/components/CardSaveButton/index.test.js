const React = require('react');
const renderer = require('react-test-renderer');

const CardSaveButton = require('.');

describe('CardSaveButton', () => {
  test('It renders', () => {
    const component = renderer.create(<CardSaveButton />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
