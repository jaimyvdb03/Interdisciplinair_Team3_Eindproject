import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OefeningenOverzicht from '../pages/OefeningenOverzicht';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => mockNavigate.mockClear());

function renderPage() {
  return render(<MemoryRouter><OefeningenOverzicht /></MemoryRouter>);
}

test('renders page title', () => {
  renderPage();
  expect(screen.getByText('Oefeningen (Tekst en Audio)')).toBeInTheDocument();
});

test('WIP items are disabled', () => {
  renderPage();
  const wipTitles = ['Vacatures zoeken', 'Het sollicitatiegesprek', 'Op tijd komen'];
  wipTitles.forEach((title) => {
    expect(screen.getByText(title).closest('button')).toBeDisabled();
  });
});

test('clicking Je CV maken navigates to /oefeningen/cv-maken', () => {
  renderPage();
  fireEvent.click(screen.getByText('Je CV maken'));
  expect(mockNavigate).toHaveBeenCalledWith('/oefeningen/cv-maken');
});

test('clicking Sollicitatiebrief navigates to /oefeningen/sollicitatiebrief', () => {
  renderPage();
  fireEvent.click(screen.getByText('Sollicitatiebrief'));
  expect(mockNavigate).toHaveBeenCalledWith('/oefeningen/sollicitatiebrief');
});

test('clicking Kleding & gedrag navigates to /oefeningen/kleding-gedrag', () => {
  renderPage();
  fireEvent.click(screen.getByText('Kleding & gedrag'));
  expect(mockNavigate).toHaveBeenCalledWith('/oefeningen/kleding-gedrag');
});

test('back button navigates to /', () => {
  renderPage();
  fireEvent.click(screen.getByText('‹'));
  expect(mockNavigate).toHaveBeenCalledWith('/');
});
