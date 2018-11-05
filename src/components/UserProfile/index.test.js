const React = require('react');
const renderer = require('react-test-renderer');

const UserProfile = require('.');

describe('UserProfile', () => {
  test('It renders', () => {
    const component = renderer.create(<UserProfile />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
