export const OMIE_CONFIG = {
    // Busca do .env ou do Railway. Se não achar nada, usa a sua chave de produção como reserva.
    APP_KEY: process.env.OMIE_APP_KEY || '2426459240205',
    APP_SECRET: process.env.OMIE_APP_SECRET || 'b354e6d4d43e7e6b779171b5691f9aa9',

    // URL base da API (Verifique se para produção a Omie usa este mesmo link)
    BASE_URL: 'https://app.omie.com.br/api/v1'
};