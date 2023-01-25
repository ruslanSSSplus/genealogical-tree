import React from 'react';
import { render, screen } from '@testing-library/react';
import AppContainer from "./AppContainer/AppContainer";

test('renders learn react link', () => {
  render(<AppContainer />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
