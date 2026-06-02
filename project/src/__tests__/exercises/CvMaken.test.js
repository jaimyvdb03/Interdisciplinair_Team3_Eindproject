import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CvMaken from '../../pages/exercises/CvMaken';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => mockNavigate.mockClear());

function renderPage() {
  return render(<MemoryRouter><CvMaken /></MemoryRouter>);
}

test('renders question and all four options', () => {
  renderPage();
  expect(screen.getByText('Wat is een CV?')).toBeInTheDocument();
  expect(screen.getByText(/Een overzicht van jezelf/i)).toBeInTheDocument();
  expect(screen.getByText(/Een brief waarin je jezelf voorstelt/i)).toBeInTheDocument();
  expect(screen.getByText(/Een formulier om een baan/i)).toBeInTheDocument();
  expect(screen.getByText(/Een test die je moet maken/i)).toBeInTheDocument();
});

test('Controleren does nothing when no answer selected', () => {
  renderPage();
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.queryByText('Terug naar home')).not.toBeInTheDocument();
});

test('selecting correct answer (A) shows positive feedback', () => {
  renderPage();
  fireEvent.click(screen.getByText(/Een overzicht van jezelf/i));
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.getByText('✓')).toBeInTheDocument();
  expect(screen.getByText(/Dit is het juiste antwoord/i)).toBeInTheDocument();
});

test('selecting wrong answer (B) shows negative feedback', () => {
  renderPage();
  fireEvent.click(screen.getByText(/Een brief waarin je jezelf voorstelt/i));
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.getByText(/sollicitatiebrief/i)).toBeInTheDocument();
});

test('closing popup hides it', () => {
  renderPage();
  fireEvent.click(screen.getByText(/Een overzicht van jezelf/i));
  fireEvent.click(screen.getByText('Controleren'));
  fireEvent.click(screen.getByText('✕'));
  expect(screen.queryByText('Terug naar home')).not.toBeInTheDocument();
});

test('Terug naar home navigates to /', () => {
  renderPage();
  fireEvent.click(screen.getByText(/Een overzicht van jezelf/i));
  fireEvent.click(screen.getByText('Controleren'));
  fireEvent.click(screen.getByText('Terug naar home'));
  expect(mockNavigate).toHaveBeenCalledWith('/');
});

test('back button navigates to /oefeningen', () => {
  renderPage();
  fireEvent.click(screen.getByText('‹'));
  expect(mockNavigate).toHaveBeenCalledWith('/oefeningen');
});
