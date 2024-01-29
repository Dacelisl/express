/* import express from 'express'
import { recoveryCodesController } from '../controllers/recoveryCodes.controller.js'

export const RecoveryCodesRoutes = express.Router()

RecoveryCodesRoutes.get('/', recoveryCodesController.getRecovery)
RecoveryCodesRoutes.post('/mail', recoveryCodesController.createMailRecover)
RecoveryCodesRoutes.get('/pass/:uid', recoveryCodesController.getRecoverToken)
RecoveryCodesRoutes.get('/pass', recoveryCodesController.getRecoveryPass)
RecoveryCodesRoutes.post('/pass', recoveryCodesController.recoveryPass)
 */