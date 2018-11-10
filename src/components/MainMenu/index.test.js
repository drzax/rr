const React = require('react');
const renderer = require('react-test-renderer');

const MainMenu = require('.');

describe('MainMenu', () => {
  test('It renders', () => {
    const component = renderer.create(<MainMenu />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
