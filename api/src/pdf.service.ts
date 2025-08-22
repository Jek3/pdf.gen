import { Injectable } from '@nestjs/common';
import { InsuranceCardDto } from './dto/insurance-card.dto';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable()
export class PdfService {
  async generateInsuranceCard(dto: InsuranceCardDto): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([350, 200]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawRectangle({
      x: 10, y: 10, width: 330, height: 180, color: rgb(0.95, 0.95, 1), borderColor: rgb(0.2, 0.2, 0.6), borderWidth: 2
    });

    page.drawText('Insurance Card', { x: 20, y: 170, size: 18, font, color: rgb(0.2, 0.2, 0.6) });
    page.drawText(`Name: ${dto.name}`, { x: 20, y: 140, size: 12, font });
    page.drawText(`Policy #: ${dto.policyNumber}`, { x: 20, y: 120, size: 12, font });
    page.drawText(`Provider: ${dto.provider}`, { x: 20, y: 100, size: 12, font });
    page.drawText(`Valid Until: ${dto.validUntil}`, { x: 20, y: 80, size: 12, font });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
