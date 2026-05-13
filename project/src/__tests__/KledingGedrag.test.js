import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import KledingGedrag from '../pages/exercises/KledingGedrag';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => mockNavigate.mockClear());

function renderPage() {
  return render(<MemoryRouter><KledingGedrag /></MemoryRouter>);
}

test('renders question', () => {
  renderPage();
  expect(screen.getByText(/Welk outfit zou je aan willen doen/i)).toBeInTheDocument();
});

test('renders all three outfit options', () => {
  renderPage();
  expect(screen.getByTestId('outfit-A')).toBeInTheDocument();
  expect(screen.getByTestId('outfit-B')).toBeInTheDocument();
  expect(screen.getByTestId('outfit-C')).toBeInTheDocument();
});

test('Controleren does nothing when no outfit selected', () => {
  renderPage();
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.queryByText('Terug naar home')).not.toBeInTheDocument();
});

test('selecting outfit A (correct) shows positive feedback', () => {
  renderPage();
  fireEvent.click(screen.getByTestId('outfit-A'));
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.getByText('✅')).toBeInTheDocument();
  expect(screen.getByText(/goede keuze/i)).toBeInTheDocument();
});

test('selecting outfit C (wrong) shows negative feedback', () => {
  renderPage();
  fireEvent.click(screen.getByTestId('outfit-C'));
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.getByText('❌')).toBeInTheDocument();
  expect(screen.getByText(/niet netjes genoeg/i)).toBeInTheDocument();
});

test('Terug naar home navigates to /', () => {
  renderPage();
  fireEvent.click(screen.getByTestId('outfit-A'));
  fireEvent.click(screen.getByText('Controleren'));
  fireEvent.click(screen.getByText('Terug naar home'));
  expect(mockNavigate).toHaveBeenCalledWith('/');
});

test('back button navigates to /oefeningen', () => {
  renderPage();
  fireEvent.click(screen.getByText('‹'));
  expect(mockNavigate).toHaveBeenCalledWith('/oefeningen');
});
