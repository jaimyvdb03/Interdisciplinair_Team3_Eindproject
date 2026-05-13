import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CvMaken from '../pages/exercises/CvMaken';
import Sollicitatiebrief from '../pages/exercises/Sollicitatiebrief';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => mockNavigate.mockClear());

// ── CV maken ────────────────────────────────────────────────

describe('CV maken quiz', () => {
  function renderCv() {
    return render(<MemoryRouter><CvMaken /></MemoryRouter>);
  }

  test('renders question and all four options', () => {
    renderCv();
    expect(screen.getByText('Wat is een CV?')).toBeInTheDocument();
    expect(screen.getByText(/Een overzicht van jezelf/i)).toBeInTheDocument();
    expect(screen.getByText(/Een brief waarin je jezelf voorstelt/i)).toBeInTheDocument();
    expect(screen.getByText(/Een formulier om een baan/i)).toBeInTheDocument();
    expect(screen.getByText(/Een test die je moet maken/i)).toBeInTheDocument();
  });

  test('Controleren does nothing when no answer selected', () => {
    renderCv();
    fireEvent.click(screen.getByText('Controleren'));
    expect(screen.queryByText('Terug naar home')).not.toBeInTheDocument();
  });

  test('selecting correct answer (A) and checking shows positive feedback', () => {
    renderCv();
    fireEvent.click(screen.getByText(/Een overzicht van jezelf/i));
    fireEvent.click(screen.getByText('Controleren'));
    expect(screen.getByText('✅')).toBeInTheDocument();
    expect(screen.getByText(/Dit is het juiste antwoord/i)).toBeInTheDocument();
  });

  test('selecting wrong answer (B) shows negative feedback', () => {
    renderCv();
    fireEvent.click(screen.getByText(/Een brief waarin je jezelf voorstelt/i));
    fireEvent.click(screen.getByText('Controleren'));
    expect(screen.getByText('❌')).toBeInTheDocument();
    expect(screen.getByText(/sollicitatiebrief/i)).toBeInTheDocument();
  });

  test('closing popup hides it', () => {
    renderCv();
    fireEvent.click(screen.getByText(/Een overzicht van jezelf/i));
    fireEvent.click(screen.getByText('Controleren'));
    fireEvent.click(screen.getByText('✕'));
    expect(screen.queryByText('Terug naar home')).not.toBeInTheDocument();
  });

  test('Terug naar home navigates to /', () => {
    renderCv();
    fireEvent.click(screen.getByText(/Een overzicht van jezelf/i));
    fireEvent.click(screen.getByText('Controleren'));
    fireEvent.click(screen.getByText('Terug naar home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('back button navigates to /oefeningen', () => {
    renderCv();
    fireEvent.click(screen.getByText('‹'));
    expect(mockNavigate).toHaveBeenCalledWith('/oefeningen');
  });
});

// ── Sollicitatiebrief ────────────────────────────────────────

describe('Sollicitatiebrief quiz', () => {
  function renderSol() {
    return render(<MemoryRouter><Sollicitatiebrief /></MemoryRouter>);
  }

  test('renders question', () => {
    renderSol();
    expect(screen.getByText(/Wat is het doel van een sollicitatiebrief/i)).toBeInTheDocument();
  });

  test('selecting correct answer (C) shows positive feedback', () => {
    renderSol();
    fireEvent.click(screen.getByText(/Je legt uit waarom jij geschikt bent/i));
    fireEvent.click(screen.getByText('Controleren'));
    expect(screen.getByText('✅')).toBeInTheDocument();
    expect(screen.getByText(/Dit is het juiste antwoord/i)).toBeInTheDocument();
  });

  test('selecting wrong answer (A) shows negative feedback', () => {
    renderSol();
    fireEvent.click(screen.getByText(/Je kijkt of er een baan beschikbaar is/i));
    fireEvent.click(screen.getByText('Controleren'));
    expect(screen.getByText('❌')).toBeInTheDocument();
  });
});
