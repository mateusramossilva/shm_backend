const axios = require('axios');
const auth = { app_key: '2426459240205', app_secret: 'b354e6d4d43e7e6b779171b5691f9aa9' };

const cpfsParaAchar = ['06352867189', '36579058803', '43311570839'];

async function debug() {
    try {
        console.log("🕵️ Buscando especificamente os 3 médicos...");
        const res = await axios.post('https://app.omie.com.br/api/v1/geral/clientes/', {
            call: 'ListarClientes',
            ...auth,
            param: [{ pagina: 1, registros_por_pagina: 500, apenas_importado_api: 'N' }]
        });

        const lista = res.data.clientes_cadastro || res.data.clientes_cadastro_res || [];

        cpfsParaAchar.forEach(alvo => {
            const achado = lista.find(c => String(c.cnpj_cpf).replace(/\D/g, '').includes(alvo.replace(/\D/g, '')));

            if (achado) {
                console.log(`✅ ACHADO: ${alvo}`);
                console.log(`   Nome na Omie: ${achado.nome_fantasia}`);
                console.log(`   Documento como está lá: "${achado.cnpj_cpf}"`);
            } else {
                console.log(`❌ NÃO ACHADO: ${alvo} entre os primeiros 500 registros.`);
            }
        });
    } catch (e) { console.log("Erro:", e.message); }
}
debug();