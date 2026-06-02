import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sollicitatiebrief from '../../pages/exercises/Sollicitatiebrief';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => mockNavigate.mockClear());

function renderPage() {
  return render(<MemoryRouter><Sollicitatiebrief /></MemoryRouter>);
}

test('renders question and all four options', () => {
  renderPage();
  expect(screen.getByText(/Wat is het doel van een sollicitatiebrief/i)).toBeInTheDocument();
  expect(screen.getByText(/Je kijkt of er een baan beschikbaar is/i)).toBeInTheDocument();
  expect(screen.getByText(/Je probeert nieuwe vrienden te maken/i)).toBeInTheDocument();
  expect(screen.getByText(/Je legt uit waarom jij geschikt bent/i)).toBeInTheDocument();
  expect(screen.getByText(/Je stuurt je CV hiermee op/i)).toBeInTheDocument();
});

test('Controleren does nothing when no answer selected', () => {
  renderPage();
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.queryByText('Terug naar home')).not.toBeInTheDocument();
});

test('selecting correct answer (C) shows positive feedback', () => {
  renderPage();
  fireEvent.click(screen.getByText(/Je legt uit waarom jij geschikt bent/i));
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.getByText('✓')).toBeInTheDocument();
  expect(screen.getByText(/Dit is het juiste antwoord/i)).toBeInTheDocument();
});

test('selecting wrong answer (A) shows negative feedback', () => {
  renderPage();
  fireEvent.click(screen.getByText(/Je kijkt of er een baan beschikbaar is/i));
  fireEvent.click(screen.getByText('Controleren'));
  expect(screen.getByText(/sollicitatiebrief is bedoeld/i)).toBeInTheDocument();
});

test('Terug naar home navigates to /', () => {
  renderPage();
  fireEvent.click(screen.getByText(/Je legt uit waarom jij geschikt bent/i));
  fireEvent.click(screen.getByText('Controleren'));
  fireEvent.click(screen.getByText('Terug naar home'));
  expect(mockNavigate).toHaveBeenCalledWith('/');
});

test('back button navigates to /oefeningen', () => {
  renderPage();
  fireEvent.click(screen.getByText('‹'));
  expect(mockNavigate).toHaveBeenCalledWith('/oefeningen');
});
