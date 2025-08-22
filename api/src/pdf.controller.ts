import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { InsuranceCardDto } from './dto/insurance-card.dto';
import { PdfService } from './pdf.service';

@ApiTags('pdf')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('insurance-card')
  @ApiOperation({ summary: 'Generate an Insurance Card' })
  @ApiResponse({ description: 'PDF', content: { 'application/pdf': {} } })
  @HttpCode(200)
  async createInsuranceCard(@Body() dto: InsuranceCardDto, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateInsuranceCard(dto);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="insurance-card.pdf"',
    });
    res.send(pdfBuffer);
  }
}
