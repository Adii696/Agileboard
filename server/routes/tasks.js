const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const taskCtrl = require('../controllers/taskController');

router.post('/', authenticate, taskCtrl.createTask);
router.put('/:id', authenticate, taskCtrl.updateTask);
router.get('/project/:projectId', authenticate, taskCtrl.listProjectTasks);

module.exports = router;
