const axios = require('axios');

// AS CHAVES QUE VOCÊ ESTÁ USANDO AGORA
const auth = {
    app_key: '2426459240205',
    app_secret: 'b354e6d4d43e7e6b779171b5691f9aa9'
};

async function descobrirDonoDaChave() {
    console.log("🕵️ Verificando identidade da API Key...");

    try {
        // Tenta listar as empresas vinculadas a essa chave
        const response = await axios.post('https://app.omie.com.br/api/v1/geral/empresas/', {
            call: 'ListarEmpresas',
            ...auth,
            param: [{ pagina: 1, registros_por_pagina: 1 }]
        });

        if (response.data.empresas_cadastro && response.data.empresas_cadastro.length > 0) {
            const empresa = response.data.empresas_cadastro[0];
            console.log("\n✅ ESTA CHAVE PERTENCE A:");
            console.log(`🏢 Nome Fantasia:  ${empresa.nome_fantasia}`);
            console.log(`📄 Razão Social:   ${empresa.razao_social}`);
            console.log(`🆔 CNPJ:           ${empresa.cnpj}`);
            console.log("---------------------------------------------------");
            console.log("💡 Se este nome NÃO for o da conta de teste que você está vendo no navegador,");
            console.log("   então você precisa gerar novas chaves na conta de teste.");
        } else {
            console.log("⚠️ A chave é válida, mas não retornou dados de empresa. Pode ser uma chave restrita.");
        }

    } catch (error) {
        console.log("\n❌ ERRO AO CONSULTAR IDENTIDADE:");
        console.log(error.response?.data?.faultstring || error.message);
    }
}

descobrirDonoDaChave();