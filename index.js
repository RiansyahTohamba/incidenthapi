const Hapi = require('@hapi/hapi');
const sqlite3 = require('sqlite3').verbose();

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Inisialisasi database SQLite
const db = new sqlite3.Database(':memory:');

// Membuat tabel 'items'
db.serialize(function() {
    db.run("CREATE TABLE items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
});

// Route untuk menampilkan semua item
server.route({
    method: 'GET',
    path: '/items',
    handler: (request, h) => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM items", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
});

// Route untuk menambahkan item baru
server.route({
    method: 'POST',
    path: '/items',
    handler: (request, h) => {
        const { name } = request.payload;
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO items (name) VALUES (?)", [name], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, name });
                }
            });
        });
    }
});

// Route untuk mengupdate item berdasarkan ID
server.route({
    method: 'PUT',
    path: '/items/{id}',
    handler: (request, h) => {
        const id = request.params.id;
        const { name } = request.payload;
        return new Promise((resolve, reject) => {
            db.run("UPDATE items SET name = ? WHERE id = ?", [name, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, name });
                }
            });
        });
    }
});

// Route untuk menghapus item berdasarkan ID
server.route({
    method: 'DELETE',
    path: '/items/{id}',
    handler: (request, h) => {
        const id = request.params.id;
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM items WHERE id = ?", [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Item with id ${id} deleted successfully` });
                }
            });
        });
    }
});

// Start server
async function start() {
    try {
        await server.start();
        console.log('Server running on %s', server.info.uri);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();
