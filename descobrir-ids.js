const axios = require('axios');

// CHAVES DA CONTA DE TESTE (GEORGE)
const auth = {
    app_key: '7206168793824',
    app_secret: 'ce0c73e8819af05b12a48c570ad16f95'
};

async function descobrir() {
    try {
        console.log("--- 🕵️ MAPEANDO A CONTA DE TESTE ---");

        // 1. BUSCAR BANCOS
        console.log("\n🏦 CONTAS CORRENTES DISPONÍVEIS:");
        const resBancos = await axios.post('https://app.omie.com.br/api/v1/geral/contacorrente/', {
            call: 'ListarContasCorrentes', ...auth,
            param: [{ pagina: 1, registros_por_pagina: 50 }]
        });

        if (resBancos.data.ListarContasCorrentes) {
            resBancos.data.ListarContasCorrentes.forEach(c => {
                console.log(`✅ NOME: "${c.descricao}" | ID (nCodCC): ${c.nCodCC}`);
            });
        } else {
            console.log("⚠️ Nenhuma conta corrente cadastrada na conta de teste!");
        }

        // 2. BUSCAR CATEGORIAS
        console.log("\n📁 CATEGORIAS DISPONÍVEIS:");
        const resCat = await axios.post('https://app.omie.com.br/api/v1/geral/categorias/', {
            call: 'ListarCategorias', ...auth,
            param: [{ pagina: 1, registros_por_pagina: 100 }]
        });

        if (resCat.data.categoria_cadastro) {
            resCat.data.categoria_cadastro.forEach(c => {
                // Filtra para mostrar só as que importam
                if (c.descricao.toUpperCase().includes('MÉDIC') || c.descricao.toUpperCase().includes('SERV')) {
                    console.log(`✅ NOME: "${c.descricao}" | CÓDIGO: ${c.codigo}`);
                }
            });
        }

    } catch (e) {
        console.log("\n❌ ERRO:", e.response?.data?.faultstring || e.message);
    }
}
descobrir();