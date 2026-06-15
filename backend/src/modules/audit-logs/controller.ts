import { asyncHandler } from '../../shared/utils/async-handler'
import { sendSuccess } from '../../shared/utils/api-response'
import { auditLogService } from './service'

export const auditLogController = {
  getAuditLogs: asyncHandler(async (_req, res) => {
    const logs = await auditLogService.getAuditLogs()
    return sendSuccess(res, {
      message: 'Global audit trail retrieved successfully',
      data: logs
    })
  })
}
