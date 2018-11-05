const React = require('react');
const renderer = require('react-test-renderer');

const LoginScreen = require('.');

describe('LoginScreen', () => {
  test('It renders', () => {
    const component = renderer.create(<LoginScreen />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
