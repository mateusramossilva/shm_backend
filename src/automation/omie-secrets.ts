export const OMIE_CONFIG = {
    // Agora ele tenta ler do Railway/Computador, se não achar, usa o valor padrão
    APP_KEY: process.env.APP_KEY || '2426459240205',
    APP_SECRET: process.env.APP_SECRET || 'b354e6d4d43e7e6b779171b5691f9aa9',

    // Configuração base da API
    BASE_URL: 'https://app.omie.com.br/api/v1'
};
