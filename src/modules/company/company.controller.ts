import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('company')
export class CompanyController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.company.findMany({
      orderBy: { nome: 'asc' }, // Ajustado de 'name' para 'nome'
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      // Removido 'include' que não existe no schema
    });
  }

  @Post()
  async create(@Body() data: { nome: string }) {
    return this.prisma.company.create({
      data: {
        nome: data.nome, // Ajustado de 'name' para 'nome'
      },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: { nome: string }) {
    return this.prisma.company.update({
      where: { id },
      data: {
        nome: data.nome, // Removido status que não existe
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.company.delete({ where: { id } });
  }
}