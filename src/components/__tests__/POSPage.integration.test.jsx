import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import POSPage from '../POSPage';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';
import { SnackbarProvider } from '../../context/SnackbarContext'; // Import SnackbarProvider

// Mocking the useNavigate hook
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => ({
    pathname: '/pos',
    search: '',
    hash: '',
    state: null,
    key: 'test',
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <SnackbarProvider> {/* Wrap with SnackbarProvider */}
          {ui}
        </SnackbarProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('POSPage Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('should display products and allow adding them to cart and checkout', async () => {
    // 1. Render the POSPage component
    renderWithProviders(<POSPage />);

    // Wait for products to load and display
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    // 2. Simulate adding products to the cart by clicking on the product cards
    const product1Card = screen.getByRole('button', { name: /Product 1/i }); // CardActionArea has role button
    fireEvent.click(product1Card);

    const product2Card = screen.getByRole('button', { name: /Product 2/i });
    fireEvent.click(product2Card);
    fireEvent.click(product2Card); // Add Product 2 twice

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Quantity of Product 1
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Quantity of Product 2
    expect(screen.getByText('Total: Rp 50.00')).toBeInTheDocument(); // 10 + 20*2 = 50

    // 3. Simulate a checkout process
    const checkoutButton = screen.getByRole('button', { name: /Checkout/i });
    fireEvent.click(checkoutButton);

    // Assert that the checkout modal is open
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Complete Sale/i })).toBeInTheDocument();
      expect(screen.getByText('Total: Rp 50.00')).toBeInTheDocument();
    });

    // Simulate clicking the "Complete Sale" button in the modal
    const completeSaleButton = screen.getByRole('button', { name: /Complete Sale/i });
    fireEvent.click(completeSaleButton);

    // Wait for the sale to complete and success message to appear
    await waitFor(() => {
      expect(screen.getByText('Sale completed successfully!')).toBeInTheDocument();
    });

    // Assert cart is empty after successful sale
    expect(screen.getByText('Cart is empty')).toBeInTheDocument();
  });
});
