import { formatPercentage } from '../../utils/utils.js'
export class ServiceDTO {
  constructor(service) {
    this.id = service._id
    this.name = service.name
    this.description = service.description
    this.profitPercentage = formatPercentage(service.profitPercentage)
  }
}
