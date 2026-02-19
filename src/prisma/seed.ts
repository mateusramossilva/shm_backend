import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando carga total da HSM (Vínculos e Escalas)...');

    // Limpa os dados antigos para evitar erros de duplicidade ou acentuação
    await prisma.escalaMapping.deleteMany();
    await prisma.vinculoMapping.deleteMany();

    // 1. TIPOS DE VÍNCULO
    const vinculos = [
        { sigla: 'SCP', nome: '200204-Distribuição de Lucros' },
        { sigla: 'PJ', nome: '200220- Prestação de Serviços Médicos' },
        { sigla: 'PJ 1', nome: '200220- Prestação de Serviços Médicos' },
    ];

    await prisma.vinculoMapping.createMany({ data: vinculos });

    // 2. ESCALAS (OS 53 REGISTROS)
    const escalas = [
        { empresa: 'VITALLIS', origem: 'Vitallis - Lagoinha Especialidades', destino: '2026-Lagoinha-Especialidades', ativa: true },
        { empresa: 'VITALLIS', origem: 'Vitallis - Monteiro Lobato PA', destino: '2028-Monteiro Lobato-PA', ativa: true },
        { empresa: 'VITALLIS', origem: 'Vitallis - Monteiro Lobato UBS', destino: '2029-Monteiro Lobato-Especialidades', ativa: true },
        { empresa: 'VITALLIS', origem: 'Vitallis - São Bento do Sapucaí', destino: '2008-São Bento do Sapucaí-Plantão Médico', ativa: true },
        { empresa: 'VITALLIS', origem: 'Vitallis - SAP Cardiologista', destino: '2025-SAP-Cardiologista', ativa: true },
        { empresa: 'VITALLIS', origem: 'Vitallis - SAP Neuroped', destino: 'Vitallis - SAP Neuroped', ativa: true },
        { empresa: 'VITALLIS', origem: 'Vitallis - Sarapuí PA', destino: 'Vitallis - Sarapuí PA', ativa: true },
        { empresa: 'VITALLIS', origem: 'Vitallis - SJC Credenciamento 02/2023', destino: '2020-SJC-Credenciameto 02/2023', ativa: true },
        { empresa: 'SHM', origem: 'CEISP - Clinico Geral', destino: '2071 - CEISP SERVIÇOS EDUCACIONAIS', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Bauru TJSP', destino: '2076-TJ BAURU', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Campinas TJSP', destino: '2077-TJ CAMPINAS', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Cejam Barueri Ortopedia', destino: '2084-CEJAM Ortopedia', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Cejam Pariquera-Açu Fisiatra', destino: '2073-CEJAM FISIATRA', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Cejam Santos Otorrino', destino: '2075-CEJAM OTORRINO', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Fernandópolis UPA', destino: '2040-Fernandopolis-Plantões', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Fusam Cirurgia Geral', destino: '2054-Fusam Cirurgia', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Fusam Pronto Atendimento Adulto', destino: '2057-Fusam PSA', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Iaras', destino: '2013-Iaras - Atenção Básica', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacareí - Cred02 - UBS Parque Santo Antonio', destino: '2061-Jacareí-Cred. Pediatra', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacareí - Cred02 - UMSF Cidade Salvador', destino: '2061-Jacareí-Cred. Pediatra', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacareí - Cred02 - UMSF Jd. Imperial', destino: '2061-Jacareí-Cred. Pediatra', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacareí - Cred02 - UMSF PMEC', destino: '2061-Jacareí-Cred. Pediatra', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacareí - Cred02 - UMSF Pq. Meia Lua', destino: '2061-Jacareí-Cred. Pediatra', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacareí - Cred02 - UMSF Santa Cruz dos Lázaros', destino: '2061-Jacareí-Cred. Pediatra', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacareí - Cred02 - UMSF. Rio Comprido', destino: '2061-Jacareí-Cred. Pediatra', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacareí - Cred03 - Caps AD', destino: '2062-Jacareí Cred. CAPS', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacareí - Cred03 - Caps II', destino: '2062-Jacareí Cred. CAPS', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacarei Casa do Abraço', destino: '2061-Jacareí-Cred. Pediatra', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Jacareí CS', destino: 'SHM - Jacareí CS', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Mandirituba HM', destino: '2072-Mandirituba', ativa: true },
        { empresa: 'SHM', origem: 'SHM - OS João Marchesi', destino: '2056-Caraguatatuba-Serviços Terceiros', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Paraibuna Especialidades', destino: '2083-CISMETRO-Paraibuna', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Pinda CAPS Infantil', destino: '2029- Pinda CAPS', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Pinda CEM', destino: '2010-Pinda-Endocrinologista', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Pinda EMAD', destino: '2036-Pinda EMAD', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Pinda Saúde Mental', destino: '2011-Pinda - Saúde Mental', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Piquete Especialidades', destino: '2069-Piquete Especialidades', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Piquete PA', destino: '2067-Piquete PA', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Ribeirão Preto TJSP', destino: '2078- TJ RIBEIRAO PRETO', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Santa Branca - UBS II', destino: '2060-Santa Branca-UBS', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Santa Branca PA', destino: '2059-Santa Branca-PA', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Santa Branca UBS Central', destino: '2060-Santa Branca-UBS', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Santos TJSP', destino: '2079- TJ SANTOS', ativa: true },
        { empresa: 'SHM', origem: 'SHM - São Bento Especialidades', destino: '2085-São Bento do Sapucaí-Especialidades', ativa: true },
        { empresa: 'SHM', origem: 'SHM - São Jose do Rio Preto TJSP', destino: '2080- TJ SAO JOSE DO RIO PRETO', ativa: true },
        { empresa: 'SHM', origem: 'SHM - SAP Especialidades', destino: 'SHM - SAP Especialidades', ativa: true },
        { empresa: 'SHM', origem: 'SHM - SAP PA', destino: '2014-SAP - Plantão Médico', ativa: true },
        { empresa: 'SHM', origem: 'SHM - SJC Cred 01/2025', destino: '2086-S.1j.Campos-Credenciamento 01-2025', ativa: true },
        { empresa: 'SHM', origem: 'SHM - SJC Credenciamento', destino: '2008-SJC-Credenciamento 02-2018', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Sorocaba TJSP', destino: '2082 - TJ SOROCABA', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Tarumã Pronto Atendimento', destino: '2070 - Tarumã PA', ativa: true },
        { empresa: 'SHM', origem: 'SHM - Taubaté Psicologia', destino: '2068-Taubaté Psicólogos', ativa: true },
        { empresa: 'SHM', origem: 'SHM- São José dos Campos TJSP', destino: '2081 - TJ SAO JOSE DOS CAMPOS', ativa: true },
    ];

    await prisma.escalaMapping.createMany({ data: escalas });

    console.log('✅ Carga finalizada: 3 Vínculos e 53 Escalas inseridas!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });