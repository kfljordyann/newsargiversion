require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`SARGI BENIN API démarrée sur http://localhost:${PORT}`);
  console.log(`Vérification : http://localhost:${PORT}/api/health`);
});
