const express = require('express');
const cors = require('cors');
const path = require('path'); 

// Importowanie tras
const userRoutes = require('./routes/userRoutes');
const stableRoutes = require('./routes/stableRoutes');
const customerRoutes = require('./routes/customerRoutes');
const eventRoutes = require('./routes/eventRoutes');
const trainingRouter = require('./routes/trainingRoutes')
const horseRoutes = require('./routes/horseRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rejestracja tras
app.use('/users', userRoutes); 
app.use('/stables', stableRoutes);
app.use('/customers', customerRoutes);
app.use('/events', eventRoutes);
app.use('/trainings', trainingRouter);
app.use('/horses', horseRoutes);

// Start serwera
app.listen(3001, () => {
    console.log(`Server is running on http://localhost:3001`);
});
