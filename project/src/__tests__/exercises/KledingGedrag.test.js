import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import KledingGedrag from '../../pages/exercises/KledingGedrag';

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
  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.getByText('B')).toBeInTheDocument();
  expect(screen.getByText('C')).toBeInTheDocument();
});

test('Controleren does nothing when no outfit selected', () => {
  renderPage();
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.queryByText('Terug naar home')).not.toBeInTheDocument();
});

test('selecting outfit A (correct) shows positive feedback', () => {
  renderPage();
  fireEvent.click(screen.getByText('A'));
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.getByText('✓')).toBeInTheDocument();
  expect(screen.getByText(/goede keuze/i)).toBeInTheDocument();
});

test('selecting outfit C (wrong) shows negative feedback', () => {
  renderPage();
  fireEvent.click(screen.getByText('C'));
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.getByText(/niet geschikt/i)).toBeInTheDocument();
});

test('Terug naar home navigates to / after completing all questions', () => {
  renderPage();
  // question 1
  fireEvent.click(screen.getByText('A'));
  fireEvent.click(screen.getByText('Controleren'));
  fireEvent.click(screen.getByText('Volgende vraag'));
  // question 2
  fireEvent.click(screen.getByText('C'));
  fireEvent.click(screen.getByText('Controleren'));
  fireEvent.click(screen.getByText('Volgende vraag'));
  // question 3 (last)
  fireEvent.click(screen.getByText('C'));
  fireEvent.click(screen.getByText('Controleren'));
  fireEvent.click(screen.getByText('Terug naar home'));
  expect(mockNavigate).toHaveBeenCalledWith('/');
});

test('back button navigates to /oefeningen', () => {
  renderPage();
  fireEvent.click(screen.getByText('‹'));
  expect(mockNavigate).toHaveBeenCalledWith('/oefeningen');
});
