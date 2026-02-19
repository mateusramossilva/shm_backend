import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OMIE_CONFIG } from './omie-secrets';

@Injectable()
export class OmieService {
  private readonly appKey = OMIE_CONFIG.APP_KEY;
  private readonly appSecret = OMIE_CONFIG.APP_SECRET;
  private readonly baseUrl = OMIE_CONFIG.BASE_URL;

  async listarTodosClientes(): Promise<any[]> {
    try {
      let pagina = 1, totalPaginas = 1, todos = [];
      while (pagina <= totalPaginas) {
        const res = await axios.post(`${this.baseUrl}/geral/clientes/`, {
          call: 'ListarClientes', app_key: this.appKey, app_secret: this.appSecret,
          param: [{ pagina, registros_por_pagina: 500, apenas_importado_api: 'N' }]
        });
        const lista = res.data.clientes_cadastro || res.data.clientes_cadastro_res || [];
        todos.push(...lista);
        totalPaginas = res.data.total_de_paginas || 1;
        pagina++;
      }
      return todos;
    } catch (e) { return []; }
  }

  async incluirContaIndividual(conta: any) {
    try {
      const res = await axios.post(`${this.baseUrl}/financas/contapagar/`, {
        call: 'IncluirContaPagar',
        app_key: this.appKey,
        app_secret: this.appSecret,
        param: [conta]
      });
      if (res.data.faultString) throw new Error(res.data.faultString);
      return res.data;
    } catch (e: any) {
      const erro = e.response?.data?.faultstring || e.message;
      throw new Error(erro);
    }
  }
}