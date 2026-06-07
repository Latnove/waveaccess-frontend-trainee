import { Router } from 'express'
import { asyncHandler } from '../../shared/http/asyncHandler.js'
import { taskController } from './task.controller.js'

export const taskRouter = Router()

taskRouter.get('/tasks/stats', asyncHandler(taskController.stats))
taskRouter.get('/tasks/top', asyncHandler(taskController.top))
taskRouter.get('/tasks', asyncHandler(taskController.list))
taskRouter.post('/tasks', asyncHandler(taskController.create))
taskRouter.get('/tasks/:taskId', asyncHandler(taskController.getById))
taskRouter.patch('/tasks/:taskId', asyncHandler(taskController.update))
taskRouter.delete('/tasks/:taskId', asyncHandler(taskController.delete))
