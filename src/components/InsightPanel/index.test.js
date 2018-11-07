const React = require('react');
const renderer = require('react-test-renderer');

const InsightPanel = require('.');

describe('InsightPanel', () => {
  test('It renders', () => {
    const component = renderer.create(<InsightPanel />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
