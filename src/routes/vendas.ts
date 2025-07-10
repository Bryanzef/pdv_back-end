import { Request, Response, Router } from 'express';
import PDFDocument from 'pdfkit';
import { autenticar, requerAdmin } from '../middleware/auth';
import Usuario from '../models/Usuario';
import Venda from '../models/Venda';

const router: Router = Router();

// Listar vendas - qualquer usuário autenticado pode ver
router.get('/', autenticar, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const filtro: any = {};
    if (req.query.usuarioId) {
      filtro.usuario = req.query.usuarioId;
    }
    if (req.query.dataInicio || req.query.dataFim) {
      filtro.data = {};
      if (req.query.dataInicio) filtro.data.$gte = new Date(req.query.dataInicio as string);
      if (req.query.dataFim) filtro.data.$lte = new Date(req.query.dataFim as string);
    }
    const [vendas, total] = await Promise.all([
      Venda.find(filtro).skip(skip).limit(limit),
      Venda.countDocuments(filtro)
    ]);
    res.json({ data: vendas, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar vendas' });
  }
});

// Cadastrar venda - qualquer usuário autenticado pode criar
router.post('/', autenticar, async (req: Request, res: Response) => {
  try {
    const venda = new Venda({ ...req.body, usuario: req.usuario?._id });
    await venda.save();
    res.status(201).json(venda);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar venda' });
  }
});

// Excluir venda - apenas admin pode excluir
router.delete('/:id', autenticar, requerAdmin, async (req: Request, res: Response) => {
  try {
    const venda = await Venda.findByIdAndDelete(req.params.id);
    if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json({ message: 'Venda excluída' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir venda' });
  }
});

// Detalhar venda por ID
router.get('/:id', autenticar, async (req: Request, res: Response) => {
  try {
    const venda = await Venda.findById(req.params.id).populate('usuario', 'nome email');
    if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json(venda);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar venda' });
  }
});

// Gerar PDF detalhado da venda
router.get('/:id/pdf', autenticar, async (req: Request, res: Response) => {
  try {
    const venda = await Venda.findById(req.params.id).lean();
    if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });

    // Buscar usuário (se houver campo usuario na venda)
    let usuario = null;
    if (venda.usuario) {
      usuario = await Usuario.findById(venda.usuario).lean();
    }

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="venda_${venda._id}.pdf"`);
    doc.pipe(res);

    doc.fontSize(18).text('Detalhes da Venda', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Data: ${new Date(venda.data).toLocaleString('pt-BR')}`);
    if (usuario) {
      doc.text(`Usuário: ${usuario.nome} (${usuario.email})`);
    }
    doc.text(`Total: R$ ${venda.total.toFixed(2)}`);
    doc.moveDown();

    // Tabela de itens
    doc.fontSize(14).text('Produtos:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    const tableTop = doc.y;
    const itemHeaders = ['Produto', 'Tipo', 'Qtd', 'Preço', 'Subtotal'];
    const colWidths = [180, 60, 50, 80, 80];
    let x = doc.x;
    itemHeaders.forEach((header, i) => {
      doc.text(header, x, tableTop, { width: colWidths[i], align: 'left', continued: i < itemHeaders.length - 1 });
      x += colWidths[i];
    });
    doc.moveDown(0.5);
    venda.itens.forEach(item => {
      let x = doc.x;
      doc.text(item.nome, x, doc.y, { width: colWidths[0], align: 'left', continued: true });
      x += colWidths[0];
      doc.text(item.tipo, x, doc.y, { width: colWidths[1], align: 'left', continued: true });
      x += colWidths[1];
      doc.text(item.quantidade.toString(), x, doc.y, { width: colWidths[2], align: 'left', continued: true });
      x += colWidths[2];
      doc.text(`R$ ${item.preco.toFixed(2)}`, x, doc.y, { width: colWidths[3], align: 'left', continued: true });
      x += colWidths[3];
      doc.text(`R$ ${item.subtotal.toFixed(2)}`, x, doc.y, { width: colWidths[4], align: 'left' });
      doc.moveDown(0.5);
    });
    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar PDF da venda' });
  }
});

export default router;