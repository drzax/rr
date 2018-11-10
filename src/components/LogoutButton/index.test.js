const React = require('react');
const renderer = require('react-test-renderer');

const LogoutButton = require('.');

describe('LogoutButton', () => {
  test('It renders', () => {
    const component = renderer.create(<LogoutButton />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
