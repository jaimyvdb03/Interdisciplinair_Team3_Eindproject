import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LessenOverzicht from '../pages/LessenOverzicht';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => mockNavigate.mockClear());

function renderPage() {
  return render(<MemoryRouter><LessenOverzicht /></MemoryRouter>);
}

test('renders page title', () => {
  renderPage();
  expect(screen.getByText('Lessen (Tekst en Audio)')).toBeInTheDocument();
});

test('renders all six lesson items', () => {
  renderPage();
  expect(screen.getByText('Je CV maken')).toBeInTheDocument();
  expect(screen.getByText('Sollicitatiebrief')).toBeInTheDocument();
  expect(screen.getByText('Kleding & gedrag')).toBeInTheDocument();
  expect(screen.getByText('Vacatures zoeken')).toBeInTheDocument();
  expect(screen.getByText('Het sollicitatiegesprek')).toBeInTheDocument();
  expect(screen.getByText('Op tijd komen')).toBeInTheDocument();
});

test('WIP items are disabled', () => {
  renderPage();
  const wipTitles = ['Kleding & gedrag', 'Vacatures zoeken', 'Het sollicitatiegesprek', 'Op tijd komen'];
  wipTitles.forEach((title) => {
    expect(screen.getByText(title).closest('button')).toBeDisabled();
  });
});

test('active item Je CV maken is not disabled', () => {
  renderPage();
  expect(screen.getByText('Je CV maken').closest('button')).not.toBeDisabled();
});

test('clicking Je CV maken navigates to /lessen/cv-maken', () => {
  renderPage();
  fireEvent.click(screen.getByText('Je CV maken'));
  expect(mockNavigate).toHaveBeenCalledWith('/lessen/cv-maken');
});

test('clicking Sollicitatiebrief navigates to /lessen/sollicitatiebrief', () => {
  renderPage();
  fireEvent.click(screen.getByText('Sollicitatiebrief'));
  expect(mockNavigate).toHaveBeenCalledWith('/lessen/sollicitatiebrief');
});

test('back button navigates to /', () => {
  renderPage();
  fireEvent.click(screen.getByText('‹'));
  expect(mockNavigate).toHaveBeenCalledWith('/');
});
