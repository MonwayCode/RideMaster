const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const stableRoutes = require('./routes/stableRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes); // Rejestracja tras użytkowników
app.use('/stables', stableRoutes);
app.use('/customers', customerRoutes);

app.listen(3001, () => {
    console.log(`Server is running on http://localhost:3001`);
});
