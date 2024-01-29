import { Schema, model } from 'mongoose'

const FinancialDetailSchema = new Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
})

const CommentSchema = new Schema({
  section: { type: String, required: true },
  content: { type: String, required: true },
})

const ReportSchema = new Schema({
  reportId: { type: Number, required: true, unique: true },
  reportDate: { type: Date, required: true, default: Date.now },
  reportType: { type: String, required: true, enum: ['monthly', 'quarterly', 'semiAnnual', 'annual'] },
  coveredPeriod: { type: String, required: true },
  totalIncome: { type: Number, required: true },
  totalExpenses: { type: Number, required: true },
  netProfit: { type: Number, required: true },

  incomeDetails: { type: [FinancialDetailSchema], default: [] },
  expenseDetails: { type: [FinancialDetailSchema], default: [] },

  executiveSummary: { type: String },
  comments: { type: [CommentSchema], default: [] },

  // Campos llenados automáticamente
  createdAt: { type: Date, default: Date.now }, // Fecha de creación del informe
  updatedAt: { type: Date }, // Fecha de última actualización

  // Campos calculados automáticamente
  averageIncomePerMonth: { type: Number }, // Ingresos promedio por mes
  averageExpensePerMonth: { type: Number }, // Gastos promedio por mes
})

export const ReportModel = model('report', ReportSchema)
