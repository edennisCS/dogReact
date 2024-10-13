import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';
import { breedsListResponse } from './mockData'; // Ensure this matches your expected mock structure

jest.mock('axios'); // Mock axios

describe('App Tests', () => {
    test('should fetch and display breeds', async () => {
        // Mock the response from the API
        axios.get.mockResolvedValueOnce({ data: breedsListResponse });

        // Render the App component
        render(<App />);

        // Wait for the axios call to be made and the breeds to be rendered
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('https://dog.ceo/api/breeds/list/all');
        });

        // Extract breed names from the mock response
        const breeds = Object.keys(breedsListResponse.message);

        // Check if each breed is displayed in the dropdown
        await waitFor(() => {
            breeds.forEach(async (breed) => {
                const option = await screen.findByText(breed.charAt(0).toUpperCase() + breed.slice(1)); // Capitalize first letter
                expect(option).toBeInTheDocument(); // Ensure the option is in the document
            });
        });
    });
});
