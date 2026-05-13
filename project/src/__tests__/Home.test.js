import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => mockNavigate.mockClear());

function renderHome() {
  return render(<MemoryRouter><Home /></MemoryRouter>);
}

test('renders welcome heading', () => {
  renderHome();
  expect(screen.getByText(/Welkom terug/i)).toBeInTheDocument();
});

test('renders all four menu cards', () => {
  renderHome();
  expect(screen.getByText('Lessen')).toBeInTheDocument();
  expect(screen.getByText('Video lessen')).toBeInTheDocument();
  expect(screen.getByText('Oefeningen')).toBeInTheDocument();
  expect(screen.getByText('Hulp nodig?')).toBeInTheDocument();
});

test('renders progress percentage', () => {
  renderHome();
  expect(screen.getByText(/40% voltooid/i)).toBeInTheDocument();
  expect(screen.getByText(/2 van 11 lessen afgerond/i)).toBeInTheDocument();
});

test('Lessen card navigates to /lessen', () => {
  renderHome();
  fireEvent.click(screen.getByText('Lessen'));
  expect(mockNavigate).toHaveBeenCalledWith('/lessen');
});

test('Oefeningen card navigates to /oefeningen', () => {
  renderHome();
  fireEvent.click(screen.getByText('Oefeningen'));
  expect(mockNavigate).toHaveBeenCalledWith('/oefeningen');
});

test('Ga verder button navigates to /lessen', () => {
  renderHome();
  fireEvent.click(screen.getByText('Ga verder'));
  expect(mockNavigate).toHaveBeenCalledWith('/lessen');
});
