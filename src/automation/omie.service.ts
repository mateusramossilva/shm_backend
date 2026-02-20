import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OmieService {
  // IMPORTANTE: Suas credenciais originais (Se precisar mudar, mude aqui)
  private readonly APP_KEY = process.env.OMIE_APP_KEY || '3335198031354';
  private readonly APP_SECRET = process.env.OMIE_APP_SECRET || 'b73715c61d5ab05c48600d3dffcfbfd4';
  private readonly OMIE_API_URL = 'https://app.omie.com.br/api/v1/';

  /**
   * Lista TODOS os clientes cadastrados na Omie manipulando a paginação.
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
        const data = response.data;

        if (data && data.clientes_cadastro) {
          todosClientes.push(...data.clientes_cadastro);
        }

        totalPaginas = data.total_de_paginas || 1;
        pagina++;
      } catch (error) {
        console.error(`Erro ao buscar página ${pagina} de clientes na Omie:`, error.response?.data?.faultstring || error.message);
        break;
      }
    } while (pagina <= totalPaginas);

    return todosClientes;
  }

  /**
   * Envia o título financeiro (Conta a Pagar) para a Omie.
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
      console.error("Erro detalhado Omie:", error.response?.data);
      throw new Error(error.response?.data?.faultstring || "Erro ao integrar com Omie");
    }
  }

  // =========================================================
  // 🚀 NOVO: CRIAÇÃO AUTOMÁTICA DE PROJETOS NA OMIE
  // =========================================================

  /**
   * Cria um novo projeto na Omie caso ele não exista e retorna o ID (nCodProjeto) gerado.
   */
  async incluirProjeto(nomeProjeto: string): Promise<number> {
    if (!nomeProjeto || nomeProjeto.trim() === '') return 0;

    try {
      const data = {
        call: "IncluirProjeto",
        app_key: this.APP_KEY,
        app_secret: this.APP_SECRET,
        param: [{
          nome: nomeProjeto.trim(),
          inativo: "N"
        }]
      };

      const response = await axios.post(`${this.OMIE_API_URL}geral/projetos/`, data);

      // A Omie retorna o ID do projeto dentro de "codigo" (ex: 2362056464)
      if (response.data && response.data.codigo) {
        return response.data.codigo;
      }

      return 0;
    } catch (error) {
      console.error(`❌ Erro ao criar projeto "${nomeProjeto}" na Omie:`, error.response?.data?.faultstring || error.message);

      // Se der erro (ex: projeto já existe mas com nome diferente), retorna 0 para o boleto não falhar
      return 0;
    }
  }
}