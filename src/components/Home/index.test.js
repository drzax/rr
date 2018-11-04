const React = require('react');
const renderer = require('react-test-renderer');

const Home = require('.');

describe('Home', () => {
  test('It renders', () => {
    const component = renderer.create(<Home />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
