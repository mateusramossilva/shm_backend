import axios from 'axios';

// SUAS CHAVES
const appKey = '2426459240205';
const appSecret = 'b354e6d4d43e7e6b779171b5691f9aa9';

// LISTA COMPLETA CRUZADA (Verifiquei e alinhei E-mail + CPF + Nome)
const CLIENTES = [
    { nome: "Ana Julia Guerche de Almeida", email: "anajuliaguerche00@hotmail.com", cpf: "036.438.422-01" },
    { nome: "Ana Laura Jonson Mendes", email: "analaurajonson00@gmail.com", cpf: "445.523.718-60" },
    { nome: "Ana Luisa Toledo Chiaradia", email: "chiaradiacare@gmail.com", cpf: "445.720.458-79" },
    { nome: "Antonio Maury Lancia Junior", email: "antoniolancia2016@yahoo.com", cpf: "459.824.638-33" },
    { nome: "Bruno Medeiros de Souza", email: "brunomedsouza97@gmail.com", cpf: "274.088.448-64" },
    { nome: "Caio Henrique Dezan Oliveira", email: "caio_dezan@hotmail.com", cpf: "017.710.402-38" },
    { nome: "Caio Viola", email: "caioviola@hotmail.com", cpf: "012.288.062-50" },
    { nome: "Carolina de Mello Miranda", email: "cahmmirandaa@gmail.com", cpf: "441.969.108-58" },
    { nome: "Claudemir Borsato de Carvalho Neto", email: "claudemirborsato@hotmail.com", cpf: "094.754.416-03" },
    { nome: "Claudia Ottaiano Galli de Faria", email: "claudiagalli01@hotmail.com", cpf: "465.827.318-74" },
    { nome: "Daicyrre Wanielli Camargo", email: "dwcamargo@hotmail.com", cpf: "173.708.738-38" },
    { nome: "Daniela Cristina Marcondes Pimenta", email: "dra.daniella.pimenta@gmail.com", cpf: "342.703.318-01" },
    { nome: "Danitieli Gonçalez da Mota", email: "danitielimota@hotmail.com", cpf: "129.315.688-48" },
    { nome: "Darick Moraes Salim Ali", email: "drdarick@gmail.com", cpf: "407.891.298-25" },
    { nome: "Eclair Graciano Inácio", email: "eclair.ufac@outlook.com", cpf: "560.487.770-00" },
    { nome: "Etore Scapin Baroni", email: "etorescapin@gmail.com", cpf: "338.106.738-97" },
    { nome: "Felipe Cesar Timporim", email: "felipetimporim20@gmail.com", cpf: "472.432.538-06" },
    { nome: "Felipe Santos Albino", email: "fsadrfelipe@gmail.com", cpf: "421.064.108-16" },
    { nome: "Fernanda Mascarenhas Moreira", email: "fernandamascarenhasmoreira@gmail.com", cpf: "383.616.288-19" },
    { nome: "Fernando Freitagas Grenga", email: "fernandofreitagas@yahoo.com.br", cpf: "063.528.671-89" },
    { nome: "Gabriel Henrique da Silva", email: "ghsilva210@gmail.com", cpf: "398.415.248-56" },
    { nome: "Gabriela de Mattos Laube", email: "gabi.mattos.laube@gmail.com", cpf: "444.080.898-00" },
    { nome: "Gabrielle Custodio Mininel", email: "gabriellecmininel@hotmail.com", cpf: "476.313.908-86" },
    { nome: "Geraldo Daniel Braga Junior", email: "geraldobragajr64@gmail.com", cpf: "365.790.588-03" },
    { nome: "Giampaulo Coelho Baliviera", email: "giampaulobaliviera@msn.com", cpf: "007.389.837-64" }
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function rodarCarga() {
    console.log(`🚀 INICIANDO CARGA DE ${CLIENTES.length} CLIENTES...`);
    console.log(`⏳ Aguardando 3 segundos para iniciar conexão...`);
    await sleep(3000);

    for (const [index, cliente] of CLIENTES.entries()) {
        try {
            const cpfLimpo = cliente.cpf.replace(/[^0-9]/g, '');

            const payload = {
                call: 'IncluirCliente',
                app_key: appKey,
                app_secret: appSecret,
                param: [{
                    codigo_cliente_integracao: `SHM-AUTO-${cpfLimpo}`,
                    email: cliente.email,
                    razao_social: cliente.nome,
                    nome_fantasia: cliente.nome,
                    cnpj_cpf: cpfLimpo,
                    tags: [{ tag: "Médico" }, { tag: "Importado" }]
                }]
            };

            // Configuração para ver o erro real
            const response = await axios.post('https://app.omie.com.br/api/v1/geral/clientes/', payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.faultString) {
                if (String(response.data.faultString).includes("já cadastrado")) {
                    console.log(`⚠️ [${index+1}] ${cliente.nome} -> JÁ CADASTRADO.`);
                } else {
                    console.error(`❌ [${index+1}] ERRO OMIE: ${response.data.faultString}`);
                }
            } else {
                console.log(`✅ [${index+1}] SUCESSO: ${cliente.nome} (ID: ${response.data.codigo_cliente_omie})`);
            }

            // Delay de segurança (0.5s)
            await sleep(500);

        } catch (error: any) {
            // AQUI ESTÁ O SEGREDO: Mostrar o erro detalhado
            const erroApi = error.response?.data?.faultstring || error.response?.statusText;
            const erroRede = error.message;

            console.error(`🔥 [${index+1}] FALHA (${cliente.nome}):`);
            console.error(`   - Detalhe: ${erroApi || erroRede}`);

            if (String(erroApi).includes("consumo indevido") || String(erroApi).includes("bloqueada")) {
                console.log("\n🛑 PARE! API BLOQUEADA. ESPERE 30 MINUTOS.");
                process.exit(1);
            }
        }
    }
    console.log("\n🏁 CARGA FINALIZADA!");
}

rodarCarga();