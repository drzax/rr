const React = require('react');
const renderer = require('react-test-renderer');

const Notification = require('.');

describe('Notification', () => {
  test('It renders', () => {
    const component = renderer.create(<Notification />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
