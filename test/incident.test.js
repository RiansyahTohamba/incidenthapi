const axios = require('axios');

// Endpoint API yang akan diuji
const API_URL = 'http://localhost:3000/items';

// Contoh data tiket untuk testing
const testData = {
    title: 'Test Ticket',
    description: 'This is a test ticket'
};

describe('Ticket API', () => {
    let createdTicketId;

    // Test untuk membuat tiket baru
    test('Create Ticket', async () => {
        const response = await axios.post(API_URL, testData);
        expect(response.status).toBe(200);
        expect(response.data.title).toBe(testData.title);
        expect(response.data.description).toBe(testData.description);
        createdTicketId = response.data.id;
    });

    // Test untuk mendapatkan semua tiket
    test('Get All Tickets', async () => {
        const response = await axios.get(API_URL);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);
    });

    // Test untuk mendapatkan tiket berdasarkan ID
    test('Get Ticket by ID', async () => {
        const response = await axios.get(`${API_URL}/${createdTicketId}`);
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdTicketId);
    });

    // Test untuk memperbarui tiket berdasarkan ID
    test('Update Ticket', async () => {
        const updatedData = {
            title: 'Updated Test Ticket',
            description: 'This is an updated test ticket'
        };
        const response = await axios.put(`${API_URL}/${createdTicketId}`, updatedData);
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdTicketId);
        expect(response.data.title).toBe(updatedData.title);
        expect(response.data.description).toBe(updatedData.description);
    });

    // Test untuk menghapus tiket berdasarkan ID
    test('Delete Ticket', async () => {
        const response = await axios.delete(`${API_URL}/${createdTicketId}`);
        expect(response.status).toBe(200);
        expect(response.data[0].id).toBe(createdTicketId);
    });

    // Test untuk memastikan tiket telah dihapus
    test('Ensure Ticket Deleted', async () => {
        try {
            await axios.get(`${API_URL}/${createdTicketId}`);
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });
});
