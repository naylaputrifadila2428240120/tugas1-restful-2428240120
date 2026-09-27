	const express = require('express');
	const app = express();
	const PORT = 3000;

    // Middleware agar req.body (JSON) dapat dibaca
app.use(express.json());

// Data sementara (disimpan di memori, hilang saat server restart)
let RentalMobil = [
  { id: 1, "platNomor": "AB 1234 CD", "merek": "Toyota", "model": "Avanza", "tahun": 2022,"hargaSewaPerHari": 350000 },
  { id: 2, "platNomor": "AB 5678 EF", "merek": "Honda", "model": "Jazz", "tahun": 2021,"hargaSewaPerHari": 400000 },

];
let nextId = 3; // penghitung id untuk data baru
	
	app.get('/', (req, res) => {
	  res.send('Server Express.js berjalan!');
	});
	
// GET /RentalMobil -> menampilkan seluruh data, bisa difilter: /RentalMobil?merek=Toyota
app.get('/RentalMobil', (req, res) => {
  const { merek } = req.query;

  if (merek) {
    const hasil = RentalMobil.filter((m) => m.merek === merek);
    return res.json(hasil);
  }

  res.json(RentalMobil);
});

// GET /RentalMobil/:id -> menampilkan satu data berdasarkan id
app.get('/RentalMobil/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = RentalMobil.find((m) => m.id === id);

  if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
  res.json(data);
});

// POST /RentalMobil
// Body: { "platNomor": "AB 1234 CD", "merek": "Toyota", "model": "Avanza", "tahun": 2022, "hargaSewaPerHari": 350000 }
app.post('/RentalMobil', (req, res) => {
  const { platNomor, merek, model, tahun, hargaSewaPerHari } = req.body;

  if (!platNomor || !merek || !model || !tahun || !hargaSewaPerHari) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  const baru = { id: nextId++, platNomor, merek, model, tahun, hargaSewaPerHari };

  RentalMobil.push(baru);
  res.status(201).json(baru);
});


// PUT /RentalMobil/2
// Body: { "platNomor": "AB 5678 EF", "merek": "Honda", "model": "Jazz", "tahun": 2021, "hargaSewaPerHari": 450000 }
app.put('/RentalMobil/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = RentalMobil.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Data tidak ditemukan' });
  }

  RentalMobil[index] = { ...RentalMobil[index], ...req.body, id };
  res.json(RentalMobil[index]);
});

// DELETE /RentalMobil/2
app.delete('/RentalMobil/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = RentalMobil.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Data tidak ditemukan' });
  }

  RentalMobil.splice(index, 1);
  res.status(204).send();
});

	app.listen(PORT, () => {
	  console.log(`Server berjalan di http://localhost:${PORT}`);
	});