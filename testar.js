const axios = require('axios');

async function testar() {
    console.log("--- INICIANDO TESTE DE CONEXÃO REAL ---");

    const payload = {
        call: 'ListarClientes',
        app_key: '2426459240205',
        app_secret: 'b354e6d4d43e7e6b779171b5691f9aa9',
        param: [{
            pagina: 1,
            registros_por_pagina: 1,
            apenas_importado_api: "N"
        }]
    };

    try {
        const response = await axios.post('https://app.omie.com.br/api/v1/geral/clientes/', payload);

        console.log("1. Status da Resposta:", response.status);
        console.log("2. O que a Omie mandou:");
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data.clientes_cadastro_res) {
            console.log("\n✅ TUDO LIMPO! A Omie liberou e os médicos estão aparecendo.");
        } else {
            console.log("\n⚠️ A resposta veio, mas sem médicos. Olhe o item 2 acima.");
        }

    } catch (error) {
        console.log("\n❌ ERRO NA CHAMADA:");
        if (error.response) {
            console.log("Status de Erro:", error.response.status);
            console.log("Detalhes do Bloqueio:");
            console.log(JSON.stringify(error.response.data, null, 2));
        } else {
            console.log("Erro de conexão local:", error.message);
        }
    }
    console.log("\n--- FIM DO TESTE ---");
}

testar();