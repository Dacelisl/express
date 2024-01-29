import { EmployeePerformanceModel } from '../models/employeePerformance.model.js'
import { EmployeePerformanceDTO } from '../../DTO/employeePerformance.dto.js'
import { EmployeePerformanceSaveDTO } from '../../DTO/employeePerformanceSave.dto.js'

class EmployeePerformanceDAO {
  POPULATE_PROJECTION = 'name description'
  async getAllEmployeePerformances() {
    try {
      const employeePerformances = await EmployeePerformanceModel.find().populate('earningsDetails.customerId', 'firstName lastName').populate('employeeId', 'firstName lastName').lean()
      const formattedEmployeePerformances = employeePerformances.map((employeePerformance) => (employeePerformance ? new EmployeePerformanceDTO(employeePerformance) : null))
      return formattedEmployeePerformances
    } catch (error) {
      throw new Error(`function DAO getAllemployeePerformances  ${error}`)
    }
  }
  async getEmployeePerformanceByID(id) {
    try {
      const employeePerformance = await EmployeePerformanceModel.findById(id).populate('employeeId', 'firstName lastName').lean()
      return employeePerformance ? new EmployeePerformanceDTO(employeePerformance) : null
    } catch (error) {
      throw new Error(`function DAO getemployeePerformanceByID  ${error}`)
    }
  }
  async createEmployeePerformance(dataEmployeePerformance) {
    try {
      const performance = new EmployeePerformanceSaveDTO(dataEmployeePerformance)
      const result = await EmployeePerformanceModel.create(performance)
      return result
    } catch (error) {
      throw new Error(`function DAO createemployeePerformance ${error}`)
    }
  }
  async deleteEmployeePerformance(objectId) {
    try {
      const result = await EmployeePerformanceModel.deleteOne({ _id: objectId })
      return result
    } catch (error) {
      throw new Error(`function DAO deleteemployeePerformance ${error}`)
    }
  }
  async updateEmployeePerformance(employeePerformanceId, dataEmployeePerformance) {
    try {
      const result = await EmployeePerformanceModel.updateOne({ _id: employeePerformanceId }, dataEmployeePerformance)
      return result
    } catch (error) {
      throw new Error(`function DAO updateEmployeePerformance: ${error}`)
    }
  }

  async getPerformanceByEmployee(employeeId) {
    try {
      const performance = await EmployeePerformanceModel.find({ employeeId })
        .populate('earningsDetails.ticketId', 'ticketNumber purchaseDate totalPayment')
        .populate({
          path: 'earningsDetails.employeePerformanceOrProduct',
          select: this.POPULATE_PROJECTION,
          match: { itemType: 'employeePerformance' },
          model: 'employeePerformance',
        })
        .populate({
          path: 'earningsDetails.employeePerformanceOrProduct',
          select: this.POPULATE_PROJECTION,
          match: { itemType: 'product' },
          model: 'product',
        })
        .lean()

      const formattedPerformance = performance.map((user) => (user ? new EmployeePerformanceDTO(user) : null))
      return formattedPerformance
    } catch (error) {
      throw new Error(`function DAO getPerformanceByEmployee  ${error}`)
    }
  }
  async getPerformanceByDate(employeeId, startDate, endDate) {
    try {
      const performance = await EmployeePerformanceModel.find({
        employeeId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .populate('earningsDetails.ticketId', 'ticketNumber purchaseDate totalPayment')
        .populate({
          path: 'earningsDetails.employeePerformanceOrProduct',
          select: this.POPULATE_PROJECTION,
          match: { itemType: 'employeePerformance' },
          model: 'employeePerformance',
        })
        .populate({
          path: 'earningsDetails.employeePerformanceOrProduct',
          select: this.POPULATE_PROJECTION,
          match: { itemType: 'product' },
          model: 'product',
        })
        .lean()
      const formattedPerformance = performance.map((user) => (user ? new EmployeePerformanceDTO(user) : null))
      return formattedPerformance
    } catch (error) {
      throw new Error(`function DAO getPerformanceByDate  ${error}`)
    }
  }
  async savePerformance(employeePerformanceData) {
    try {
      const result = await EmployeePerformanceModel.create(employeePerformanceData)
      return result
    } catch (error) {
      throw new Error(`function DAO savePerformance  ${error}`)
    }
  }
  async updatePerformanceById(performanceId, updatedData) {
    try {
      const result = await EmployeePerformanceModel.findByIdAndUpdate(performanceId, updatedData, { new: true })
      return result
    } catch (error) {
      throw new Error(`function DAO updatePerformanceById  ${error}`)
    }
  }
  async deletePerformanceById(performanceId) {
    try {
      const result = await EmployeePerformanceModel.findByIdAndDelete(performanceId)
      return result
    } catch (error) {
      throw new Error(`function DAO deletePerformanceById  ${error}`)
    }
  }
}

export const employeePerformanceDAO = new EmployeePerformanceDAO()
