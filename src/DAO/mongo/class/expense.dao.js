import { ExpenseModel } from '../models/expense.model.js'

class ExpenseDAO {
  async getExpenses() {
    try {
      const expenses = await ExpenseModel.find().populate('employeeId', 'firstName lastName email').populate('supplierId', 'name email').lean()

      return expenses
    } catch (error) {
      console.error('Error al obtener gastos:', error)
      throw error
    }
  }

  async getExpenseById(id) {
    try {
      const expense = await ExpenseModel.findById(id).populate('employeeId', 'firstName lastName email').populate('supplierId', 'name email').lean()

      return expense
    } catch (error) {
      console.error('Error al obtener gasto por ID:', error)
      throw error
    }
  }
  async getExpensesByCategory(category) {
    try {
      const expenses = await ExpenseModel.find({ category }).populate('employeeId', 'firstName lastName').populate('supplierId', 'name').lean()
      return expenses
    } catch (error) {
      console.error('Error al obtener gastos por categoría:', error)
      throw error
    }
  }
  async getExpensesByEmployee(employeeId) {
    try {
      const expenses = await ExpenseModel.find({ employeeId }).populate('employeeId', 'firstName lastName').lean()

      return expenses
    } catch (error) {
      console.error('Error al obtener gastos por empleado:', error)
      throw error
    }
  }
  async getExpensesBySupplier(supplierId) {
    try {
      const expenses = await ExpenseModel.find({ supplierId }).populate('supplierId', 'name').lean()

      return expenses
    } catch (error) {
      console.error('Error al obtener gastos por proveedor:', error)
      throw error
    }
  }

  async saveExpense(expenseData) {
    try {
      const result = await ExpenseModel.create(expenseData)
      return result
    } catch (error) {
      console.error('Error al guardar gasto:', error)
      throw error
    }
  }

  async deleteExpenseById(id) {
    try {
      const result = await ExpenseModel.deleteOne({ _id: id })
      return result
    } catch (error) {
      console.error('Error al eliminar gasto por ID:', error)
      throw error
    }
  }

  async updateExpense(expenseData) {
    try {
      const { _id, ...updateData } = expenseData
      const result = await ExpenseModel.updateOne({ _id }, updateData)
      return result
    } catch (error) {
      console.error('Error al actualizar gasto:', error)
      throw error
    }
  }
}

export const expenseDAO = new ExpenseDAO()
