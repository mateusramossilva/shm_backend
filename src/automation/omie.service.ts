import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OmieService {
  // Credenciais de acesso à API Omie
  private readonly APP_KEY = process.env.OMIE_APP_KEY || '3335198031354';
  private readonly APP_SECRET = process.env.OMIE_APP_SECRET || 'b73715c61d5ab05c48600d3dffcfbfd4';
  private readonly OMIE_API_URL = 'https://app.omie.com.br/api/v1/';

  /**
   * Lista todos os clientes/fornecedores cadastrados para bater o CPF/CNPJ
   */
  async listarTodosClientes(): Promise<any[]> {
    let pagina = 1;
    let totalPaginas = 1;
    const todosClientes = [];

    do {
      const payload = {
        call: "ListarClientes",
        app_key: this.APP_KEY,
        app_secret: this.APP_SECRET,
        param: [
          {
            pagina: pagina,
            registros_por_pagina: 500,
            apenas_importado_api: "N"
          }
        ]
      };

      try {
        const response = await axios.post(`${this.OMIE_API_URL}geral/clientes/`, payload);
        if (response.data && response.data.clientes_cadastro) {
          todosClientes.push(...response.data.clientes_cadastro);
        }
        totalPaginas = response.data.total_de_paginas || 1;
        pagina++;
      } catch (error) {
        console.error(`Erro ao buscar página ${pagina} de clientes:`, error.message);
        break;
      }
    } while (pagina <= totalPaginas);

    return todosClientes;
  }

  /**
   * Envia o título financeiro para a Omie (IncluirContaPagar)
   */
  async incluirContaIndividual(payload: any): Promise<any> {
    const body = {
      call: "IncluirContaPagar",
      app_key: this.APP_KEY,
      app_secret: this.APP_SECRET,
      param: [payload]
    };

    try {
      const response = await axios.post(`${this.OMIE_API_URL}financas/contapagar/`, body);
      return response.data;
    } catch (error) {
      console.error("❌ Erro na integração com Omie:", error.response?.data || error.message);
      throw new Error(error.response?.data?.faultstring || "Erro ao integrar com Omie");
    }
  }

  // =========================================================
  // 🚀 CRIAÇÃO DINÂMICA DE PROJETOS (COLUNA H)
  // =========================================================

  /**
   * Tenta incluir um projeto novo na Omie e retorna o código gerado.
   * Se o projeto já existir ou der erro, retorna 0 para não travar o processo.
   */
  async incluirProjeto(nomeProjeto: string): Promise<number> {
    if (!nomeProjeto || nomeProjeto.trim() === '') return 0;

    const nomeLimpo = nomeProjeto.trim();

    try {
      const data = {
        call: "IncluirProjeto",
        app_key: this.APP_KEY,
        app_secret: this.APP_SECRET,
        param: [{
          nome: nomeLimpo,
          inativo: "N"
        }]
      };

      // Endpoint oficial de Projetos da Omie
      const response = await axios.post(`${this.OMIE_API_URL}geral/projetos/`, data);

      // Retorna o nCodProjeto gerado pela Omie
      if (response.data && response.data.codigo) {
        console.log(`✨ Projeto '${nomeLimpo}' cadastrado com sucesso! ID: ${response.data.codigo}`);
        return response.data.codigo;
      }

      return 0;
    } catch (error) {
      // Se a Omie retornar erro de que o projeto já existe, ela não deixa criar.
      // Nesse caso o log ajuda a identificar, mas retornamos 0 para seguir o fluxo.
      const msgErro = error.response?.data?.faultstring || error.message;
      console.warn(`⚠️ Aviso ao criar projeto "${nomeLimpo}": ${msgErro}`);
      return 0;
    }
  }
}